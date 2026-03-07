import { collection, doc, addDoc, getDoc, updateDoc, onSnapshot, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function iniciarSessao(
    alunoUid: string,
    personalFlexId: string,
    personalNome: string,
    exercicios: any[]
): Promise<string> {
    const sessoesCol = collection(db, 'sessions');
    const sessaoRef = await addDoc(sessoesCol, {
        alunoUid,
        personalFlexId,
        personalNome,
        exercicios,
        status: 'ACTIVE',
        startTime: new Date()
    });

    return sessaoRef.id;
}

export async function marcarExercicioSet(
    sessionId: string,
    exercicioIndex: number,
    cargaUsada: number
): Promise<void> {
    const sessaoRef = doc(db, 'sessions', sessionId);
    const sessaoSnap = await getDoc(sessaoRef);

    if (sessaoSnap.exists()) {
        const data = sessaoSnap.data();
        const exercicios = data.exercicios || [];

        if (exercicios[exercicioIndex]) {
            // Create sets array if it doesn't exist
            if (!exercicios[exercicioIndex].sets) {
                exercicios[exercicioIndex].sets = [];
            }

            // Append the new set
            exercicios[exercicioIndex].sets.push({
                carga: cargaUsada,
                timestamp: new Date()
            });

            // Update document
            await updateDoc(sessaoRef, { exercicios });
        }
    }
}

export async function encerrarSessao(
    sessionId: string,
    rpeGeral: number,
    notaTrainer: string
): Promise<void> {
    const sessaoRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessaoRef, {
        status: 'DONE',
        rpeGeral,
        notaTrainer,
        endTime: new Date()
    });
}

export function subscribeSessaoAtiva(
    alunoUid: string,
    callback: (sessao: any | null) => void
) {
    const q = query(
        collection(db, 'sessions'),
        where('alunoUid', '==', alunoUid),
        where('status', '==', 'ACTIVE'),
        limit(1)
    );

    return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
}

export function subscribeAlunosPresentes(
    callback: (checkIns: any[]) => void
) {
    const dataHoje = new Date().toISOString().split('T')[0];
    const q = query(
        collection(db, 'check_ins'),
        where('data', '==', dataHoje),
        where('presente', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(list);
    });
}

export async function adicionarTeamNote(
    alunoUid: string,
    trainerNome: string,
    texto: string
): Promise<void> {
    const teamNotesCol = collection(db, 'team_notes');
    await addDoc(teamNotesCol, {
        alunoUid,
        trainerNome,
        texto,
        timestamp: new Date()
    });
}

export function subscribeTeamNotes(
    alunoUid: string,
    callback: (notes: any[]) => void
) {
    const q = query(
        collection(db, 'team_notes'),
        where('alunoUid', '==', alunoUid),
        orderBy('timestamp', 'desc'),
        limit(10)
    );

    return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(list);
    });
}

export async function obterUltimaSessao(alunoUid: string): Promise<any | null> {
    const q = query(
        collection(db, 'sessions'),
        where('alunoUid', '==', alunoUid),
        where('status', '==', 'DONE'),
        orderBy('endTime', 'desc'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    return null;
}
