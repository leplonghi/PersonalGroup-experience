import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// 1. onCheckIn: Atualiza perfil do aluno ao fazer check-in
export const onCheckIn = functions.firestore
    .document("check_ins/{checkInId}")
    .onCreate(async (snap: any, _context: any) => {
        const data = snap.data();
        functions.logger.info("Novo aluno fez check-in:", data.uid);

        if (!data.uid) return;

        await db.collection("users").doc(data.uid).update({
            isCheckedIn: true,
            checkInTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            "stats.totalCheckins": admin.firestore.FieldValue.increment(1),
        });
    });

// 2. dailyFrequencyCheck: Às 22h, marca isCheckedIn=false e acumula faltas
export const dailyFrequencyCheck = functions.pubsub
    .schedule("0 22 * * *")
    .timeZone("America/Sao_Paulo")
    .onRun(async (_context: any) => {
        functions.logger.info("Executando checagem diária de frequência");

        const today = new Date().toISOString().split("T")[0];
        const usersSnap = await db.collection("users")
            .where("role", "==", "ALUNO")
            .get();

        const batch = db.batch();

        for (const userDoc of usersSnap.docs) {
            const userData = userDoc.data();
            const checkInRef = db.collection("check_ins").doc(`${userDoc.id}_${today}`);
            const checkIn = await checkInRef.get();

            const missedToday = !checkIn.exists;
            const updates: Record<string, any> = { isCheckedIn: false };

            if (missedToday && userData.weeklyFrequency) {
                updates.missedThisWeek = admin.firestore.FieldValue.increment(1);
            }

            batch.update(userDoc.ref, updates);
        }

        await batch.commit();
        functions.logger.info(`Check diário concluído para ${usersSnap.size} alunos.`);
    });

// 3. onSessionComplete: Salva insight quando sessão trainer-led é concluída
export const onSessionComplete = functions.firestore
    .document("sessions/{sessionId}")
    .onUpdate(async (change: any, context: any) => {
        const before = change.before.data();
        const after = change.after.data();

        if (before.status !== "DONE" && after.status === "DONE") {
            functions.logger.info(`Session ${context.params.sessionId} completed.`);
            const rpe = after.rpeGeral;

            let message = "Bom treino!";
            if (rpe !== undefined) {
                if (rpe >= 9) {
                    message = "Descanse bastante, este foi um treino intenso!";
                } else if (rpe <= 4) {
                    message = "Tente aumentar um pouco a intensidade no próximo treino!";
                }
            }

            await db.collection("users").doc(after.alunoUid).update({
                "stats.totalSessions": admin.firestore.FieldValue.increment(1),
            });

            await db.collection("users").doc(after.alunoUid).collection("insights").add({
                type: "SESSION_FEEDBACK",
                message,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
    });

// 4. updateStudentFrequency: Toda segunda-feira, reseta missedThisWeek
export const updateStudentFrequency = functions.pubsub
    .schedule("0 0 * * 1")
    .timeZone("America/Sao_Paulo")
    .onRun(async (_context: any) => {
        functions.logger.info("Atualização semanal de estatísticas (segunda-feira).");

        const usersSnap = await db.collection("users")
            .where("role", "==", "ALUNO")
            .get();

        const batch = db.batch();
        usersSnap.docs.forEach(doc => {
            batch.update(doc.ref, { missedThisWeek: 0 });
        });

        await batch.commit();
        functions.logger.info(`Semana zerada para ${usersSnap.size} alunos.`);
    });
