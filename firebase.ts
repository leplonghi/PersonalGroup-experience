
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  increment,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  deleteField
} from "firebase/firestore";
import {
  User,
  TrainingCycle,
  Protocol,
  SessionLog,
  Assessment,
  TimelineEntry,
  AppMessage,
  MessageType,
  UserRole,
  HealthStatus,
  WellnessBooking
} from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "personalgroup-exclusive.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "personalgroup-exclusive",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "personalgroup-exclusive.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

let app;
let dbInstance;

try {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export const db = dbInstance || {} as any;

// --- Collection References ---
export const usersCol = collection(db, "users");
export const sessoesCol = collection(db, "sessoes");
export const protocolosCol = collection(db, "protocolos");
export const ciclosCol = collection(db, "ciclos");
export const avaliacoesCol = collection(db, "avaliacoes");
export const wellnessCol = collection(db, "wellness");
export const mensagensCol = collection(db, "mensagens");
export const timelineCol = collection(db, "timeline");

// --- Automação: Sistema de Alertas Interno ---
const triggerSystemAlert = async (userId: string, title: string, content: string, type: MessageType = 'INSTITUTIONAL') => {
  await addDoc(mensagensCol, {
    userId,
    type,
    title,
    content,
    date: new Date().toLocaleDateString('pt-BR'),
    timestamp: serverTimestamp(),
    read: false,
    author: 'SISTEMA EXCLUSIVE'
  });
};

// --- Automação: Controle Mensal de Wellness ---
const checkAndResetWellness = async (user: User) => {
  const currentMonth = new Date().getMonth();
  if (user.lastWellnessResetMonth !== currentMonth) {
    await updateDoc(doc(db, "users", user.id), {
      wellnessSessionsUsed: 0,
      lastWellnessResetMonth: currentMonth,
      activeWellnessBookings: []
    });
    return true;
  }
  return false;
};

// --- Service Functions ---

export const syncUser = async (user: User): Promise<User> => {
  try {
    const userRef = doc(db, "users", user.id);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const newUser = {
        ...user,
        createdAt: serverTimestamp(),
        wellnessSessionsUsed: 0,
        lastWellnessResetMonth: new Date().getMonth(),
        activeWellnessBookings: []
      };
      await setDoc(userRef, newUser);
      return user;
    }
    const data = snap.data() as User;
    await checkAndResetWellness(data);
    return data;
  } catch (error) {
    console.error("Erro syncUser:", error);
    throw error;
  }
};

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
      type: "VERSION_UPDATE", // Reusing type for management action
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

    if (newStatus === 'WARNING') {
      await triggerSystemAlert(assessment.studentId, "Atenção Governança", "Sua última avaliação sugere ajustes pontuais na prática. Verifique seu status no próximo treino.", "SEGMENTED");
    }
  } catch (error) {
    console.error("Erro saveAssessment:", error);
    throw error;
  }
};

// Fix: added serviceName parameter and property to bookWellness to satisfy WellnessBooking type
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

export const saveProtocol = async (protocol: Protocol) => {
  try {
    const protocolRef = doc(db, "protocolos", protocol.id);
    const snap = await getDoc(protocolRef);

    let version = protocol.version;
    if (snap.exists()) {
      const oldData = snap.data() as Protocol;
      if (oldData.name !== protocol.name || JSON.stringify(oldData.exercises) !== JSON.stringify(protocol.exercises)) {
        version = (parseFloat(oldData.version) + 0.1).toFixed(1);
      }
    }

    await setDoc(protocolRef, {
      ...protocol,
      version,
      serverTimestamp: serverTimestamp(),
      lastUpdated: new Date().toLocaleDateString('pt-BR')
    }, { merge: true });

    if (snap.exists()) {
      await addDoc(timelineCol, {
        userId: 'SYSTEM_ADMIN',
        type: "VERSION_UPDATE",
        referenceId: protocol.id,
        timestamp: serverTimestamp(),
        message: `Protocolo "${protocol.name}" atualizado para v${version}`
      });
    }
  } catch (error) {
    console.error("Erro saveProtocol:", error);
    throw error;
  }
};

export const getProtocols = async (): Promise<Protocol[]> => {
  try {
    const q = query(protocolosCol, orderBy("lastUpdated", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Protocol));
  } catch (error) {
    return [];
  }
};

export const getTimeline = async (userId: string): Promise<TimelineEntry[]> => {
  try {
    const q = query(timelineCol, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      date: d.data().timestamp?.toDate ? d.data().timestamp.toDate().toLocaleDateString('pt-BR') : 'Hoje'
    } as TimelineEntry));
  } catch (error) {
    return [];
  }
};

export const getMessages = async (userId: string): Promise<AppMessage[]> => {
  try {
    const q = query(mensagensCol, where("userId", "in", [userId, "PUBLIC"]), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AppMessage));
  } catch (error) {
    return [];
  }
};
