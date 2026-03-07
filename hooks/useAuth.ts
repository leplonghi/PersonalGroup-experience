
import { useState, useEffect } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User, UserRole } from '../types';
import { PRESET_AVATARS } from '../constants';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// Maps a Firebase Auth user to our Firestore user doc
const fetchUserDoc = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return { id: firebaseUser.uid, ...snap.data() } as User;
};

// Creates a minimal user doc on first sign-up
const createUserDoc = async (
    firebaseUser: FirebaseUser,
    extraData: Partial<User> = {}
): Promise<User> => {
    const defaultAvatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
    const avatarToUse = firebaseUser.photoURL || defaultAvatar;

    const newUser: Omit<User, 'currentCycle'> & { createdAt: any } = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || extraData.name || 'Usuário',
        email: firebaseUser.email || '',
        role: UserRole.ALUNO,
        avatar: avatarToUse,
        photoUrl: avatarToUse,
        healthStatus: 'NORMAL',
        wellnessSessionsUsed: 0,
        lastWellnessResetMonth: new Date().getMonth(),
        activeWellnessBookings: [],
        createdAt: serverTimestamp(),
        ...extraData,
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser, { merge: true });
    return newUser as User;
};

// --- Hook ---

interface AuthState {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    signInWithEmail: (email: string, password: string) => Promise<User>;
    signUpWithEmail: (email: string, password: string, userData: Partial<User>) => Promise<User>;
    signInWithGoogle: () => Promise<User>;
    signOut: () => Promise<void>;
    updateLocalUser: (updated: User) => void;
}

export type UseAuthReturn = AuthState & AuthActions;

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>({
        user: null,
        firebaseUser: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setState({ user: null, firebaseUser: null, loading: false, error: null });
                return;
            }
            try {
                const user = await fetchUserDoc(firebaseUser);
                setState({ user, firebaseUser, loading: false, error: null });
            } catch (err) {
                console.error('useAuth: error fetching user doc', err);
                setState({ user: null, firebaseUser, loading: false, error: 'Erro ao carregar perfil.' });
            }
        });
        return () => unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string): Promise<User> => {
        setState(s => ({ ...s, loading: true, error: null }));
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = await fetchUserDoc(cred.user);
        if (!user) throw new Error('Perfil não encontrado. Contate a academia.');
        setState(s => ({ ...s, user, firebaseUser: cred.user, loading: false }));
        return user;
    };

    const signUpWithEmail = async (
        email: string,
        password: string,
        userData: Partial<User>
    ): Promise<User> => {
        setState(s => ({ ...s, loading: true, error: null }));
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = await createUserDoc(cred.user, userData);
        setState(s => ({ ...s, user, firebaseUser: cred.user, loading: false }));
        return user;
    };

    const signInWithGoogle = async (): Promise<User> => {
        setState(s => ({ ...s, loading: true, error: null }));
        const cred = await signInWithPopup(auth, googleProvider);
        // If first time, create user doc; otherwise fetch existing
        let user = await fetchUserDoc(cred.user);
        if (!user) {
            user = await createUserDoc(cred.user);
        }
        setState(s => ({ ...s, user, firebaseUser: cred.user, loading: false }));
        return user;
    };

    const signOut = async (): Promise<void> => {
        await firebaseSignOut(auth);
        setState({ user: null, firebaseUser: null, loading: false, error: null });
    };

    const updateLocalUser = (updated: User) => {
        setState(s => ({ ...s, user: updated }));
    };

    return {
        ...state,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        updateLocalUser,
    };
};
