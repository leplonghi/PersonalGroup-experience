import { doc, getDoc, setDoc, updateDoc, addDoc, serverTimestamp, increment, deleteField, arrayUnion, arrayRemove, onSnapshot, query, where, orderBy, limit, getDocs, collection } from "firebase/firestore";
import { db, sessoesCol, timelineCol, avaliacoesCol, wellnessCol, checkInsCol, liveSessionsCol } from "./firebaseCore";
import { User, TrainingCycle, SessionLog, Assessment, HealthStatus, WellnessBooking, LiveSession } from "../types";
import { triggerSystemAlert } from "./adminService";
import { evolutionCol } from "./firebaseCore";

export const logSession = async (userId: string, cycleId: string, logs: SessionLog[]) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() as User;

        if (userData.needsAssessment) {
            throw new Error("Sessão Bloqueada: Avaliação Pendente.");
        }

        if (userData.healthStatus === 'CRITICAL') {
            throw new Error("Sessão Bloqueada: Condição de Saúde Crítica.");
        }

        const sessionRef = await addDoc(sessoesCol, {
            userId,
            cycleId,
            timestamp: serverTimestamp(),
            logs
        });

        const avgRpe = logs.reduce((acc, l) => acc + l.rpe, 0) / logs.length;
        let suggestedIncrement = 0;
        if (avgRpe < 7) suggestedIncrement = 5;

        const cycleRef = doc(db, "ciclos", cycleId);
        const cycleSnap = await getDoc(cycleRef);
        const cycleData = cycleSnap.data() as TrainingCycle;

        await updateDoc(cycleRef, {
            currentSession: increment(1),
            suggestedLoadIncrement: suggestedIncrement
        });

        if (cycleData.currentSession + 1 >= cycleData.totalSessions) {
            await updateDoc(userRef, { needsAssessment: true });
            await triggerSystemAlert(userId, "Ciclo Finalizado", "Seu ciclo estratégico foi concluído. Uma nova avaliação foi solicitada automaticamente.", "SEGMENTED");
        }

        if (logs.some(l => l.rpe === 10)) {
            await addDoc(timelineCol, {
                userId,
                type: "HEALTH_ALERT",
                referenceId: sessionRef.id,
                timestamp: serverTimestamp(),
                message: "ALERTA: Esforço Máximo Detectado (RPE 10).",
                details: "Protocolo de recuperação sugerido."
            });
            await triggerSystemAlert(userId, "Atenção: Esforço Máximo", "Detectamos RPE 10 em sua última sessão. Recomendamos hidratação extra e 8h de sono hoje.", "INSTITUTIONAL");
        }

        await addDoc(timelineCol, {
            userId,
            type: "SESSION_COMPLETE",
            referenceId: sessionRef.id,
            timestamp: serverTimestamp(),
            message: "Sessão concluída.",
            details: `RPE Médio: ${avgRpe.toFixed(1)}`
        });

    } catch (error) {
        console.error("Erro logSession:", error);
        throw error;
    }
};

export const startNewCycle = async (userId: string, cycle: TrainingCycle) => {
    try {
        const cycleRef = doc(db, "ciclos", cycle.id);
        await setDoc(cycleRef, { ...cycle, userId, createdAt: serverTimestamp() });
        await updateDoc(doc(db, "users", userId), { currentCycle: cycle, needsAssessment: false });

        await triggerSystemAlert(userId, "Novo Ciclo Ativado", `Sua nova jornada "${cycle.name}" começou. Foco na execução!`, "MOTIVATIONAL");

        await addDoc(timelineCol, {
            userId,
            type: "CYCLE_START",
            referenceId: cycle.id,
            timestamp: serverTimestamp(),
            message: `Ciclo: ${cycle.name}`
        });
    } catch (error) {
        console.error("Erro startNewCycle:", error);
        throw error;
    }
};

export const terminateCycle = async (userId: string) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            needsAssessment: true,
            currentCycle: deleteField()
        });

        await triggerSystemAlert(userId, "Ciclo Encerrado", "Seu ciclo foi finalizado prematuramente pela governança técnica. Agende sua avaliação.", "SEGMENTED");

        await addDoc(timelineCol, {
            userId,
            type: "VERSION_UPDATE",
            referenceId: "manual_termination",
            timestamp: serverTimestamp(),
            message: "Ciclo encerrado manualmente pela governança."
        });
    } catch (error) {
        console.error("Erro terminateCycle:", error);
        throw error;
    }
};

export const saveAssessment = async (assessment: Assessment, newStatus: HealthStatus) => {
    try {
        const assessmentRef = await addDoc(avaliacoesCol, { ...assessment, timestamp: serverTimestamp() });

        await updateDoc(doc(db, "users", assessment.studentId), {
            needsAssessment: false,
            lastAssessmentDate: assessment.date,
            healthStatus: newStatus
        });

        await addDoc(timelineCol, {
            userId: assessment.studentId,
            type: "ASSESSMENT_COMPLETE",
            referenceId: assessmentRef.id,
            timestamp: serverTimestamp(),
            message: `Avaliação ${assessment.type} validada.`,
            details: `Status: ${newStatus === 'NORMAL' ? 'Liberado' : 'Ajuste Requerido'} • Massa Magra: ${assessment.data.leanMass}kg`
        });

        await addDoc(evolutionCol, {
            userId: assessment.studentId,
            date: assessment.date,
            weight: assessment.data.weight,
            bodyFat: assessment.data.fatPercentage,
            leanMass: assessment.data.leanMass,
            createdAt: serverTimestamp()
        });

        if (newStatus === 'WARNING') {
            await triggerSystemAlert(assessment.studentId, "Atenção Governança", "Sua última avaliação sugere ajustes pontuais na prática. Verifique seu status no próximo treino.", "SEGMENTED");
        }
    } catch (error) {
        console.error("Erro saveAssessment:", error);
        throw error;
    }
};

export const bookWellness = async (userId: string, serviceId: string, serviceName: string, date: string, time: string) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() as User;

        if (userData.wellnessSessionsUsed && userData.wellnessSessionsUsed >= 2) {
            throw new Error("Limite de Wellness mensal atingido.");
        }

        const booking: WellnessBooking = {
            id: Math.random().toString(36).substring(2, 11),
            serviceId,
            serviceName,
            date,
            time,
            status: 'CONFIRMADO'
        };

        const bookingRef = await addDoc(wellnessCol, {
            ...booking,
            userId,
            timestamp: serverTimestamp()
        });

        await updateDoc(userRef, {
            wellnessSessionsUsed: increment(1),
            activeWellnessBookings: arrayUnion(booking)
        });

        await addDoc(timelineCol, {
            userId,
            type: "WELLNESS_BOOKED",
            referenceId: bookingRef.id,
            timestamp: serverTimestamp(),
            message: "Wellness Confirmado.",
            details: `${serviceId} em ${date} às ${time}`
        });

        return booking;
    } catch (error) {
        console.error("Erro bookWellness:", error);
        throw error;
    }
};

export const cancelWellness = async (userId: string, booking: WellnessBooking) => {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            wellnessSessionsUsed: increment(-1),
            activeWellnessBookings: arrayRemove(booking)
        });

        await addDoc(timelineCol, {
            userId,
            type: "WELLNESS_CANCELLED",
            referenceId: booking.id,
            timestamp: serverTimestamp(),
            message: "Wellness Cancelado.",
            details: `${booking.serviceId} em ${booking.date} às ${booking.time}`
        });
    } catch (error) {
        console.error("Erro cancelWellness:", error);
        throw error;
    }
};

export const performCheckIn = async (userId: string, gymId: string) => {
    try {
        await addDoc(checkInsCol, {
            userId,
            gymId,
            timestamp: serverTimestamp(),
            verified: true
        });

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            lastCheckIn: serverTimestamp(),
            isCheckedIn: true,
            currentGymId: gymId,
            status: 'ACTIVE_IN_GYM'
        });

        await addDoc(timelineCol, {
            userId,
            type: "CHECK_IN",
            referenceId: gymId,
            timestamp: serverTimestamp(),
            message: "Check-in Confirmado",
            details: "Personal Group Experience"
        });

        return true;
    } catch (error) {
        console.error("Erro performCheckIn:", error);
        throw error;
    }
};

export const startLiveSession = async (studentId: string, personalId: string, personalName: string, protocolId: string): Promise<void> => {
    const sessionRef = doc(liveSessionsCol, studentId);
    await setDoc(sessionRef, {
        studentId,
        personalId,
        personalName,
        protocolId,
        currentExerciseIdx: 0,
        currentSet: 1,
        isResting: false,
        restTimeRemaining: 0,
        status: 'ACTIVE',
        logs: [],
        lastUpdate: serverTimestamp()
    });

    // --- Sync with Floor View ---
    const dateStr = new Date().toISOString().split('T')[0];
    const checkInRef = doc(checkInsCol, `${studentId}_${dateStr}`);
    try {
        await updateDoc(checkInRef, {
            emSessao: true,
            trainerNome: personalName
        });
    } catch (e) {
        console.warn("Check-in doc not found for today. Skipping floor view sync.", e);
    }
};

export const updateLiveSession = async (studentId: string, data: Partial<LiveSession>): Promise<void> => {
    const sessionRef = doc(liveSessionsCol, studentId);
    await updateDoc(sessionRef, {
        ...data,
        lastUpdate: serverTimestamp()
    });
};

export const subscribeToLiveSession = (studentId: string, callback: (session: LiveSession | null) => void) => {
    const sessionRef = doc(liveSessionsCol, studentId);
    return onSnapshot(sessionRef, (snap) => {
        if (snap.exists()) {
            callback(snap.data() as LiveSession);
        } else {
            callback(null);
        }
    });
};

export const endLiveSession = async (studentId: string): Promise<void> => {
    const sessionRef = doc(liveSessionsCol, studentId);
    await updateDoc(sessionRef, {
        status: 'FINISHED',
        lastUpdate: serverTimestamp()
    });

    // --- Sync with Floor View (Clear) ---
    const dateStr = new Date().toISOString().split('T')[0];
    const checkInRef = doc(checkInsCol, `${studentId}_${dateStr}`);
    try {
        await updateDoc(checkInRef, {
            emSessao: false,
            trainerNome: null
        });
    } catch (e) {
        console.warn("Check-in doc not found for today. Skipping floor view sync removal.", e);
    }
};

export const getLastTrainerSession = async (studentId: string) => {
    const q = query(
        collection(db, "sessions"),
        where("alunoUid", "==", studentId),
        where("status", "==", "DONE"),
        orderBy("endTime", "desc"),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
};
