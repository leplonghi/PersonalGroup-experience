import { doc, getDoc, addDoc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, limit, increment, Timestamp } from "firebase/firestore";
import { db, timelineCol, mensagensCol, checkInsCol, adminRequestsCol, evolutionCol, usersCol, adminLogsCol, importacoesCol } from "./firebaseCore";
import { TimelineEntry, AppMessage, MessageType, GymConfig, CheckInRecord, FrequencyReport, AdminRequest, EvolutionEntry, User, UserRole, ImportacaoAluno, LogImportacao, ImportConflict } from "../types";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseCore";

export const triggerSystemAlert = async (userId: string, title: string, content: string, type: MessageType = 'INSTITUTIONAL') => {
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
    gymUnit: 'Personal Group',
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
    const day = date.getDay();
    const timeStr = date.toTimeString().slice(0, 5);

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

export const getDaysUntilEvent = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const past = new Date(dateStr);
    const now = new Date();
    const msElapsed = now.getTime() - past.getTime();
    return Math.floor(msElapsed / (1000 * 60 * 60 * 24));
};

export const checkPersonalDayDue = (lastAssessmentDate?: string): boolean => {
    const days = getDaysUntilEvent(lastAssessmentDate);
    return days !== null && days >= 45 && days < 50;
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

    // Audit Log
    await logAdminAction(
        resolvedBy,
        'SYSTEM', // Global or Request specific
        'RESOLVE_REQUEST',
        `Pedido de suporte resolvido (${status}): ${requestId}`
    );
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

export const logAdminAction = async (
    adminId: string, 
    targetId: string, 
    action: string, 
    details: string
): Promise<void> => {
    try {
        await addDoc(adminLogsCol, {
            adminId,
            targetId,
            action,
            details,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Erro ao registrar ação administrativa:", e);
    }
};

/**
 * Validates CPF format and digits (simple version)
 */
const isValidCPF = (cpf: string): boolean => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1+$/.test(clean)) return false;
    // Simple length check for now, can be expanded if needed
    return true;
};

export const detectImportConflicts = async (students: any[]): Promise<ImportConflict[]> => {
    const conflicts: ImportConflict[] = [];

    for (let i = 0; i < students.length; i++) {
        const s = students[i];
        const email = s.email?.trim().toLowerCase();
        const cpf = s.cpf?.toString().replace(/\D/g, '') || '';

        if (!email && !cpf) continue;

        // Search for existing user
        let existingUser: User | null = null;
        
        if (email) {
            const q = query(usersCol, where("email", "==", email));
            const snap = await getDocs(q);
            if (!snap.empty) existingUser = { id: snap.docs[0].id, ...snap.docs[0].data() } as User;
        }

        if (!existingUser && cpf) {
            const q = query(usersCol, where("cpf", "==", cpf));
            const snap = await getDocs(q);
            if (!snap.empty) existingUser = { id: snap.docs[0].id, ...snap.docs[0].data() } as User;
        }

        if (existingUser) {
            const differences: ImportConflict['differences'] = [];
            const newUserData: any = {};

            // Compare specific fields
            const fieldsToCompare = [
                { key: 'name', label: 'Nome', val: s.nomeCompleto },
                { key: 'plan.type', label: 'Tipo do Plano', val: s.plano?.toUpperCase() },
                { key: 'plan.renewalDate', label: 'Vencimento', val: s.dataVencimento },
            ];

            fieldsToCompare.forEach(f => {
                let oldVal: any;
                if (f.key.includes('.')) {
                    const keys = f.key.split('.');
                    oldVal = (existingUser as any)[keys[0]]?.[keys[1]];
                } else {
                    oldVal = (existingUser as any)[f.key];
                }

                if (f.val && f.val !== oldVal) {
                    differences.push({ field: f.label, oldValue: oldVal || 'Não definido', newValue: f.val });
                    newUserData[f.key] = f.val;
                }
            });

            if (differences.length > 0) {
                conflicts.push({
                    index: i,
                    existingUser,
                    newUserData,
                    differences
                });
            }
        }
    }

    return conflicts;
};

export const importStudents = async (
    adminId: string,
    students: any[],
    filename: string,
    authorizedMerges: Record<number, boolean> = {}
): Promise<LogImportacao> => {
    const log: Omit<LogImportacao, 'id'> = {
        arquivo: filename,
        totalLinhas: students.length,
        importadosComSucesso: 0,
        mesclados: 0,
        erros: [],
        realizadoEm: new Date(),
        realizadoPor: adminId
    };

    for (let i = 0; i < students.length; i++) {
        const s = students[i];
        try {
            const nome = s.nomeCompleto?.trim();
            const email = s.email?.trim().toLowerCase();
            const cpfRaw = s.cpf?.toString() || '';
            const cpf = cpfRaw.replace(/\D/g, '');

            if (!nome) throw new Error("Nome completo é obrigatório");
            if (!email || !email.includes('@')) throw new Error("E-mail inválido ou ausente");
            if (!cpf) throw new Error("CPF é obrigatório");
            if (!isValidCPF(cpf)) throw new Error(`CPF inválido: ${cpfRaw}`);

            // Check uniqueness
            const emailQuery = query(usersCol, where("email", "==", email));
            const emailSnap = await getDocs(emailQuery);
            
            const cpfQuery = query(usersCol, where("cpf", "==", cpf));
            const cpfSnap = await getDocs(cpfQuery);

            const existingDoc = !emailSnap.empty ? emailSnap.docs[0] : (!cpfSnap.empty ? cpfSnap.docs[0] : null);

            if (existingDoc) {
                if (authorizedMerges[i]) {
                    // Update existing
                    const updateData: any = {};
                    if (s.nomeCompleto) updateData.name = s.nomeCompleto;
                    if (s.plano || s.dataVencimento) {
                        const currentPlan = existingDoc.data().plan || {};
                        updateData.plan = {
                            ...currentPlan,
                            type: (s.plano || currentPlan.type || 'GOLD').toUpperCase(),
                            renewalDate: s.dataVencimento || currentPlan.renewalDate || ""
                        };
                    }
                    await updateDoc(doc(db, "users", existingDoc.id), updateData);
                    
                    const details = `Dados mesclados via importação (${filename}): ` + 
                        Object.keys(updateData).map(k => `${k}`).join(', ');

                    await logAdminAction(adminId, existingDoc.id, 'IMPORT_MERGE', details);
                    
                    // Adicionar uma notificação interna para o aluno saber que dados foram atualizados
                    await triggerSystemAlert(
                        existingDoc.id, 
                        'Cadastro Atualizado', 
                        'Seus dados de plano e cadastro foram atualizados via sincronização administrativa.',
                        'INSTITUTIONAL'
                    );

                    log.mesclados!++;
                    continue;
                } else {
                    throw new Error(`Conflito: ${!emailSnap.empty ? 'E-mail' : 'CPF'} já cadastrado e não autorizado para mesclagem.`);
                }
            }

            // Provisioning
            const defaultPass = cpf.substring(0, 6);
            
            const newUser: any = {
                name: nome,
                email: email,
                cpf: cpf,
                role: UserRole.ALUNO,
                avatar: "",
                healthStatus: 'NORMAL',
                plan: {
                    type: (s.plano || 'GOLD').toUpperCase(),
                    name: s.plano || 'Plano Padrão',
                    renewalDate: s.dataVencimento || "",
                    status: 'ACTIVE',
                    price: '0,00'
                },
                importacaoId: 'pending_auth', 
                tempPassword: defaultPass,
                createdAt: serverTimestamp(),
                unit: "Personal Group Exclusive"
            };

            await addDoc(usersCol, newUser);
            log.importadosComSucesso++;
        } catch (err: any) {
            log.erros.push({ linha: i + 1, motivo: err.message });
        }
    }

    const docRef = await addDoc(importacoesCol, {
        ...log,
        realizadoEm: serverTimestamp()
    });

    return { id: docRef.id, ...log } as LogImportacao;
};

export const getImportationLogs = async (): Promise<LogImportacao[]> => {
    try {
        const q = query(importacoesCol, orderBy("realizadoEm", "desc"), limit(20));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            realizadoEm: d.data().realizadoEm?.toDate() || new Date()
        } as LogImportacao));
    } catch (error) {
        console.error("Erro ao buscar logs de importação:", error);
        return [];
    }
};
