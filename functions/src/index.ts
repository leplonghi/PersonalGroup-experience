import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// 1. onCheckIn: Firestore trigger on onCreate of check_ins/{id}
export const onCheckIn = functions.firestore
    .document("check_ins/{checkInId}")
    .onCreate(async (snap: any, context: any) => {
        const data = snap.data();
        functions.logger.info("Novo aluno fez check-in:", data.uid);
        // TODO: Notificar trainers via push de app (FCM) ou outro trigger
    });

// 2. dailyFrequencyCheck: Schedule '0 22 * * *' America/Sao_Paulo
export const dailyFrequencyCheck = functions.pubsub
    .schedule("0 22 * * *")
    .timeZone("America/Sao_Paulo")
    .onRun(async (context: any) => {
        functions.logger.info("Executando checagem diária de frequência");
        // Lógica para comparar check-ins da semana vs meta de frequência de cada aluno:
        // const usersRef = db.collection('users');
        // ...
    });

// 3. onSessionComplete: Firestore trigger onUpdate of sessions/{sessionId}
export const onSessionComplete = functions.firestore
    .document("sessions/{sessionId}")
    .onUpdate(async (change: any, context: any) => {
        const before = change.before.data();
        const after = change.after.data();

        // Verify if status changed to DONE
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

            functions.logger.info("Mensagem para o aluno:", message);
            // Aqui pode haver um salvamento da "insight" ou envio de notificação
            await db.collection("users").doc(after.alunoUid).collection("insights").add({
                type: "SESSON_FEEDBACK",
                message: message,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
    });

// 4. updateStudentFrequency: Schedule '0 0 * * 1' America/Sao_Paulo
export const updateStudentFrequency = functions.pubsub
    .schedule("0 0 * * 1")
    .timeZone("America/Sao_Paulo")
    .onRun(async (context: any) => {
        functions.logger.info("Atualização semanal de estatísticas (segunda-feira).");
        // Lógica para fechar a semana anterior, zerar contadores rotativos e registrar relatórios
    });
