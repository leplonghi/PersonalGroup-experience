/**
 * Seed Test Users Utility
 * 
 * Creates 4 test users in Firebase Auth + Firestore:
 * - ALUNO: aluno@test.com / Test@123
 * - PERSONAL: personal@test.com / Test@123
 * - CHEFE: chefe@test.com / Test@123
 * - ADMIN: admin@test.com / Test@123
 * 
 * Usage: Import and call seedTestUsers() or use the dev panel in Login
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { UserRole } from './types';

const auth = getAuth();

export interface TestAccount {
    email: string;
    password: string;
    role: UserRole;
    name: string;
    label: string;
    color: string;
}

export const TEST_ACCOUNTS: TestAccount[] = [
    {
        email: 'aluno@test.com',
        password: 'Test@123',
        role: UserRole.ALUNO,
        name: 'Carlos Teste (Aluno)',
        label: 'Aluno',
        color: '#3B82F6', // blue
    },
    {
        email: 'personal@test.com',
        password: 'Test@123',
        role: UserRole.PERSONAL,
        name: 'Prof. Marina Teste',
        label: 'Personal',
        color: '#22C55E', // green
    },
    {
        email: 'chefe@test.com',
        password: 'Test@123',
        role: UserRole.CHEFE,
        name: 'Dr. Rafael Teste',
        label: 'Chefe',
        color: '#F59E0B', // amber
    },
    {
        email: 'admin@test.com',
        password: 'Test@123',
        role: UserRole.ADMIN,
        name: 'Admin Sistema',
        label: 'Admin',
        color: '#EF4444', // red
    },
];

/**
 * Creates a single test user in Auth + Firestore.
 * If the user already exists in Auth, just ensures Firestore doc exists.
 */
export const createTestUser = async (account: TestAccount): Promise<string> => {
    let uid: string;

    try {
        // Try to create new Auth user
        const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
        uid = cred.user.uid;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            // User exists — sign in to get uid, then sign out
            const cred = await signInWithEmailAndPassword(auth, account.email, account.password);
            uid = cred.user.uid;
        } else {
            throw error;
        }
    }

    // Ensure Firestore user document exists
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            id: uid,
            name: account.name,
            email: account.email,
            role: account.role,
            avatar: '',
            photoUrl: '',
            healthStatus: 'NORMAL',
            wellnessSessionsUsed: 0,
            lastWellnessResetMonth: new Date().getMonth(),
            activeWellnessBookings: [],
            createdAt: serverTimestamp(),
            // Extra fields for testing
            sex: 'M',
            age: 28,
            whatsapp: '11999999999',
            objectives: 'Ganho de massa muscular e condicionamento',
            limitations: 'Nenhuma',
            trainingPreferences: 'Musculação e funcional',
            planStartDate: new Date().toISOString().split('T')[0],
            planEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            weeklyFrequency: 4,
            // Personal-specific fields
            ...(account.role === UserRole.PERSONAL || account.role === UserRole.CHEFE ? {
                specialties: ['Musculação', 'Funcional', 'Reabilitação'],
                availableHours: 'Seg-Sex: 06:00-20:00',
                bio: 'Especialista em treinamento personalizado com 8 anos de experiência.',
                certifications: ['CREF 012345-G/SP', 'Especialização em Fisiologia do Exercício'],
            } : {}),
        });
    } else {
        // Update role if doc exists but role is wrong
        const data = snap.data();
        if (data.role !== account.role) {
            await setDoc(userRef, { role: account.role }, { merge: true });
        }
    }

    return uid;
};

/**
 * Creates all 4 test users. Returns summary.
 */
export const seedTestUsers = async (): Promise<string[]> => {
    const results: string[] = [];

    for (const account of TEST_ACCOUNTS) {
        try {
            const uid = await createTestUser(account);
            results.push(`✅ ${account.label}: ${account.email} (uid: ${uid})`);
        } catch (error: any) {
            results.push(`❌ ${account.label}: ${error.message}`);
        }
    }

    return results;
};

/**
 * Quick login for a test account.
 */
export const loginAsTestUser = async (account: TestAccount) => {
    return signInWithEmailAndPassword(auth, account.email, account.password);
};
