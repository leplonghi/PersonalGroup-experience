import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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
export const adminRequestsCol = collection(db, "admin_requests");
export const gymConfigCol = collection(db, "config");
export const liveSessionsCol = collection(db, "active_sessions");
