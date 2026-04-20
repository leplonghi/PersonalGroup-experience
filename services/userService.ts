import { doc, getDoc, setDoc, updateDoc, serverTimestamp, query, where, getDocs, onSnapshot, arrayUnion, limit, orderBy, startAfter } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, usersCol } from "./firebaseCore";
import { User, UserRole, TrainingCycle } from "../types";

export const getUserById = async (userId: string): Promise<User | null> => {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? snap.data() as User : null;
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
        const q = query(usersCol, where("role", "==", UserRole.ALUNO), limit(50));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
    } catch (error) {
        console.error("Erro getStudents:", error);
        return [];
    }
};

export const getStudentsPaginated = async (lastDoc?: any): Promise<{ students: User[], lastVisible: any }> => {
    try {
        let q = query(usersCol, where("role", "==", UserRole.ALUNO), orderBy("name"), limit(50));
        if (lastDoc) q = query(q, startAfter(lastDoc));
        const snap = await getDocs(q);
        const students = snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
        return { students, lastVisible: snap.docs[snap.docs.length - 1] };
    } catch (error) {
        console.error("Erro getStudentsPaginated:", error);
        return { students: [], lastVisible: null };
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

export const toggleUserRoleWithAudit = async (adminId: string, userId: string, currentRole: UserRole, targetName: string): Promise<UserRole> => {
    const newRole = await toggleUserRole(userId, currentRole);
    // Logging is imported conditionally or used from adminService in the UI layer to avoid circular dependency
    // For now we'll update the component to handle the second call
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
