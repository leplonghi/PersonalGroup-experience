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
  deleteField,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import {
  getAuth,
  updateProfile
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
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
  WellnessBooking,
  GymConfig,
  AdminRequest,
  AdminRequestType,
  EvolutionEntry,
  FrequencyReport,
  CheckInRecord,
  LiveSession
} from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAO_wofC2ALURjj7VCRQVnDj5dButWzxPw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "personalgroup-exclusive.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "personalgroup-exclusive",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "personalgroup-exclusive.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1080923445966",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1080923445966:web:a93d6e159857f8abf8ce9f"
};

let app;
let dbInstance: any;
let authInstance: any;
let storageInstance: any;

try {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
  storageInstance = getStorage(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export const db = dbInstance || {} as any;
export const auth = authInstance;
export const storage = storageInstance;

// --- Collection References ---
export const usersCol = collection(db, "users");
export const sessoesCol = collection(db, "sessoes");
export const protocolosCol = collection(db, "protocolos");
export const ciclosCol = collection(db, "ciclos");
export const avaliacoesCol = collection(db, "avaliacoes");
export const wellnessCol = collection(db, "wellness");
export const mensagensCol = collection(db, "mensagens");
export const timelineCol = collection(db, "timeline");
export const checkInsCol = collection(db, "checkins");
export const evolutionCol = collection(db, "evolution");

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

export const getUserById = async (userId: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() as User : null;
};

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

export const createUserDoc = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
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

    // Mirror to evolution history for charts
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

export const performCheckIn = async (userId: string, gymId: string) => {
  try {
    // 1. Create Check-in Record
    await addDoc(checkInsCol, {
      userId,
      gymId,
      timestamp: serverTimestamp(),
      verified: true
    });

    // 2. Update User Status for Admin/Staff visibility
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastCheckIn: serverTimestamp(),
      isCheckedIn: true,
      currentGymId: gymId,
      status: 'ACTIVE_IN_GYM' // This flag helps Admins filter active users
    });

    // 3. Log to Timeline
    await addDoc(timelineCol, {
      userId,
      type: "CHECK_IN",
      referenceId: gymId,
      timestamp: serverTimestamp(),
      message: "Check-in Confirmado",
      details: "Unidade Península Jardins"
    });

    return true;
  } catch (error) {
    console.error("Erro performCheckIn:", error);
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



export const getProtocolById = async (protocolId: string): Promise<Protocol | null> => {
  try {
    const protocolRef = doc(db, "protocolos", protocolId);
    const snap = await getDoc(protocolRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Protocol;
  } catch (error) {
    console.error("Erro getProtocolById:", error);
    return null;
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

// ============================================================
// NEW FUNCTIONS — Etapas 1-5
// ============================================================

// --- Additional collection refs ---
const adminRequestsCol = collection(db, "admin_requests");
const gymConfigCol = collection(db, "config");

// --- Etapa 1: Profile & Photo ---

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
};

export const updateUserCycle = async (userId: string, cycle: TrainingCycle): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { currentCycle: cycle, updatedAt: serverTimestamp() });
};

export const getStudents = async (): Promise<User[]> => {
  try {
    const q = query(usersCol, where("role", "==", UserRole.ALUNO));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
  } catch (error) {
    console.error("Erro getStudents:", error);
    return [];
  }
};

export const getStaff = async (): Promise<User[]> => {
  try {
    const q = query(usersCol, where("role", "in", [UserRole.PERSONAL, UserRole.CHEFE]));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
  } catch (error) {
    console.error("Erro getStaff:", error);
    return [];
  }
};

export const subscribeToActiveStaff = (callback: (staff: User[]) => void) => {
  const q = query(
    usersCol,
    where("role", "in", [UserRole.PERSONAL, UserRole.CHEFE]),
    where("status", "==", "ACTIVE_IN_GYM")
  );
  return onSnapshot(q, (snap) => {
    const staff = snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
    callback(staff);
  });
};

export const toggleUserRole = async (userId: string, currentRole: UserRole): Promise<UserRole> => {
  const newRole = currentRole === UserRole.PERSONAL ? UserRole.CHEFE : UserRole.PERSONAL;
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role: newRole, updatedAt: serverTimestamp() });
  return newRole;
};

export const updateStaffFlex = async (staffId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", staffId);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
};

export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage não inicializado.");
  const photoRef = storageRef(storage, `profile_photos/${userId}/${file.name}`);
  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);
  await updateDoc(doc(db, "users", userId), { photoUrl: url, avatar: url });
  return url;
};

// --- Etapa 2: Gym Config & Frequency ---

const DEFAULT_GYM_CONFIG: GymConfig = {
  hours: {
    weekdays: { open: '05:30', close: '22:00' },
    saturday: { open: '07:00', close: '13:00' },
    sunday: { open: '08:00', close: '13:00' },
    holidays: { open: '08:00', close: '13:00' },
  },
  maxWellnessPerMonth: 2,
  timezone: 'America/Sao_Paulo',
  gymName: 'PersonalGroup Exclusive',
  gymUnit: 'Unidade Península Jardins',
};

export const getGymConfig = async (): Promise<GymConfig> => {
  try {
    const snap = await getDoc(doc(db, "config", "gym"));
    if (snap.exists()) return snap.data() as GymConfig;
    return DEFAULT_GYM_CONFIG;
  } catch {
    return DEFAULT_GYM_CONFIG;
  }
};

export const isGymOpen = (config: GymConfig, date: Date = new Date()): { open: boolean; closeAt?: string; reason?: string } => {
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const timeStr = date.toTimeString().slice(0, 5); // 'HH:MM'

  let hours = config.hours.weekdays;
  if (day === 6) hours = config.hours.saturday;
  else if (day === 0) hours = config.hours.sunday;

  const isOpen = timeStr >= hours.open && timeStr < hours.close;
  return {
    open: isOpen,
    closeAt: hours.close,
    reason: isOpen ? undefined : `Academia fechada. Horário: ${hours.open}–${hours.close}`
  };
};

export const recordNoShow = async (userId: string, reason?: string): Promise<void> => {
  await updateDoc(doc(db, "users", userId), {
    noShowCount: increment(1),
    missedThisWeek: increment(1)
  });
  await addDoc(checkInsCol, {
    userId, type: "NO_SHOW", reason: reason || 'Sem justificativa',
    timestamp: serverTimestamp()
  });
};

// --- Etapa 3: Frequency Reports & CSV ---

export const getFrequencyReport = async (
  userId: string,
  period: 'week' | 'month' | 'year'
): Promise<FrequencyReport> => {
  const now = new Date();
  let startDate: Date;
  if (period === 'week') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  const q = query(
    checkInsCol,
    where("userId", "==", userId),
    where("timestamp", ">=", Timestamp.fromDate(startDate)),
    orderBy("timestamp", "desc")
  );
  const snap = await getDocs(q);
  const checkIns: CheckInRecord[] = snap.docs.map(d => ({
    id: d.id,
    userId,
    timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    method: d.data().method || 'MANUAL',
    gymId: d.data().gymId || ''
  }));

  return {
    userId,
    period,
    totalSessions: checkIns.length,
    plannedSessions: period === 'week' ? 5 : period === 'month' ? 20 : 240,
    attendanceRate: Math.min(100, Math.round((checkIns.length / (period === 'week' ? 5 : period === 'month' ? 20 : 240)) * 100)),
    noShows: 0,
    checkIns
  };
};

export const exportToCSV = (data: Record<string, any>[], filename: string): void => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// --- Etapa 4: Assessment Dates & Wellness Slots ---

export const getDaysUntilEvent = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  const past = new Date(dateStr);
  const now = new Date();
  const msElapsed = now.getTime() - past.getTime();
  return Math.floor(msElapsed / (1000 * 60 * 60 * 24));
};

export const checkPersonalDayDue = (lastAssessmentDate?: string): boolean => {
  const days = getDaysUntilEvent(lastAssessmentDate);
  return days !== null && days >= 45 && days < 50; // window: days 45-49
};

export const checkReassessmentDue = (lastAssessmentDate?: string): boolean => {
  const days = getDaysUntilEvent(lastAssessmentDate);
  return days !== null && days >= 90;
};

export const getDaysUntilReassessment = (lastAssessmentDate?: string): number | null => {
  const days = getDaysUntilEvent(lastAssessmentDate);
  if (days === null) return null;
  return Math.max(0, 90 - days);
};

// --- Etapa 5: Admin Requests ---

export const createAdminRequest = async (request: Omit<AdminRequest, 'id' | 'status' | 'createdAt'>): Promise<string> => {
  const ref = await addDoc(adminRequestsCol, {
    ...request,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return ref.id;
};

export const resolveAdminRequest = async (
  requestId: string,
  status: 'approved' | 'rejected',
  resolvedBy: string,
  resolution?: string
): Promise<void> => {
  await updateDoc(doc(db, "admin_requests", requestId), {
    status,
    resolvedBy,
    resolution: resolution || '',
    resolvedAt: serverTimestamp()
  });
};

export const getAdminRequests = async (userId?: string): Promise<AdminRequest[]> => {
  try {
    const q = userId
      ? query(adminRequestsCol, where("userId", "==", userId), orderBy("createdAt", "desc"))
      : query(adminRequestsCol, orderBy("createdAt", "desc"), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminRequest));
  } catch {
    return [];
  }
};

// --- Etapa 5: Evolution ---

export const addEvolutionEntry = async (entry: Omit<EvolutionEntry, 'id'>): Promise<string> => {
  const ref = await addDoc(evolutionCol, { ...entry, createdAt: serverTimestamp() });
  return ref.id;
};

export const getEvolutionEntries = async (userId: string): Promise<EvolutionEntry[]> => {
  try {
    const q = query(evolutionCol, where("userId", "==", userId), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as EvolutionEntry));
  } catch {
    return [];
  }
};

export const uploadEvolutionPhoto = async (userId: string, file: File, date: string): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage não inicializado.");
  const photoRef = storageRef(storage, `evolution/${userId}/${date}_${file.name}`);
  await uploadBytes(photoRef, file);
  return getDownloadURL(photoRef);
};

// --- Etapa 5: Segmented Messaging ---

export const sendSegmentedMessage = async (
  targetRole: string,
  title: string,
  content: string,
  authorId: string
): Promise<void> => {
  const q = targetRole === 'ALL'
    ? await getDocs(usersCol)
    : await getDocs(query(usersCol, where("role", "==", targetRole)));

  const batch = q.docs.map(d =>
    addDoc(mensagensCol, {
      userId: d.id,
      type: 'SEGMENTED',
      title,
      content,
      date: new Date().toLocaleDateString('pt-BR'),
      timestamp: serverTimestamp(),
      read: false,
      author: authorId
    })
  );
  await Promise.all(batch);
};

// --- Biometric & Wearables ---

export const enableBiometrics = async (userId: string, credentialId: string): Promise<void> => {
  await updateDoc(doc(db, "users", userId), {
    biometricEnabled: true,
    biometricCredentialId: credentialId,
    updatedAt: serverTimestamp()
  });
};

export const syncWearable = async (userId: string, device: string, data?: any): Promise<void> => {
  await updateDoc(doc(db, "users", userId), {
    connectedDevices: arrayUnion(device),
    healthData: data, // Generic health data blob
    updatedAt: serverTimestamp()
  });
};

// --- Real-time Session Sync ---
export const liveSessionsCol = collection(db, "active_sessions");

export const startLiveSession = async (studentId: string, personalId: string, personalName: string, protocolId: string): Promise<void> => {
  const sessionRef = doc(db, "active_sessions", studentId);
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
};

export const updateLiveSession = async (studentId: string, data: Partial<LiveSession>): Promise<void> => {
  const sessionRef = doc(db, "active_sessions", studentId);
  await updateDoc(sessionRef, {
    ...data,
    lastUpdate: serverTimestamp()
  });
};

export const subscribeToLiveSession = (studentId: string, callback: (session: LiveSession | null) => void) => {
  const sessionRef = doc(db, "active_sessions", studentId);
  return onSnapshot(sessionRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as LiveSession);
    } else {
      callback(null);
    }
  });
};

export const endLiveSession = async (studentId: string): Promise<void> => {
  const sessionRef = doc(db, "active_sessions", studentId);
  await updateDoc(sessionRef, {
    status: 'FINISHED',
    lastUpdate: serverTimestamp()
  });
  // Optional: move to history and delete active session document
};

