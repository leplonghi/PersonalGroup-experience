import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
        "Firebase: variáveis de ambiente VITE_FIREBASE_* não configuradas. " +
        "Crie um arquivo .env baseado em .env.example antes de iniciar a aplicação."
    );
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// --- Collection References ---
export const usersCol = collection(db, "users");
export const sessoesCol = collection(db, "sessoes");
export const protocolosCol = collection(db, "protocolos");
export const ciclosCol = collection(db, "ciclos");
export const avaliacoesCol = collection(db, "avaliacoes");
export const wellnessCol = collection(db, "wellness");
export const mensagensCol = collection(db, "mensagens");
export const timelineCol = collection(db, "timeline");
export const checkInsCol = collection(db, "check_ins");
export const evolutionCol = collection(db, "evolution");
export const adminRequestsCol = collection(db, "admin_requests");
export const gymConfigCol = collection(db, "config");
export const adminLogsCol = collection(db, "admin_logs");
// Live session state (staff-synced, used by ActiveSession component)
export const liveSessionsCol = collection(db, "active_sessions");
export const importacoesCol = collection(db, "importacoes");
