import { doc, getDoc, setDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { db, protocolosCol } from "./firebaseCore";
import { Protocol } from "../types";
import { triggerSystemAlert } from "./adminService"; // We will create this next
import { addDoc } from "firebase/firestore";
import { timelineCol } from "./firebaseCore";

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
