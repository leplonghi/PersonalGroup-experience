import { doc, setDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const ACADEMIA_CONFIG = {
    lat: -2.5015997909840357,
    lng: -44.31083495121163,
    raio: 100, // metros
    nome: 'PersonalGroup'
};

export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export function obterLocalizacao(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocalização não suportada pelo navegador'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
        });
    });
}

export function verificarDentroDoRaio(lat: number, lng: number): boolean {
    const distancia = calcularDistancia(lat, lng, ACADEMIA_CONFIG.lat, ACADEMIA_CONFIG.lng);
    return distancia <= ACADEMIA_CONFIG.raio;
}

export async function registrarCheckIn(
    uid: string,
    energiaLevel: 'low' | 'medium' | 'high',
    limitacao?: string
): Promise<void> {
    const dataHoje = new Date().toISOString().split('T')[0];
    const checkInId = `${uid}_${dataHoje}`;
    const checkInRef = doc(db, 'check_ins', checkInId);

    await setDoc(checkInRef, {
        uid,
        data: dataHoje,
        energiaLevel,
        limitacao: limitacao || null,
        presente: true,
        timestamp: new Date()
    });
}

export async function verificarCheckInHoje(uid: string): Promise<boolean> {
    const dataHoje = new Date().toISOString().split('T')[0];
    const checkInId = `${uid}_${dataHoje}`;
    const checkInRef = doc(db, 'check_ins', checkInId);
    const docSnap = await getDoc(checkInRef);

    return docSnap.exists();
}

export function subscribeCheckInsHoje(callback: (checkIns: any[]) => void) {
    const dataHoje = new Date().toISOString().split('T')[0];
    const q = query(
        collection(db, 'check_ins'),
        where('data', '==', dataHoje),
        where('presente', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
        const checkIns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(checkIns);
    });
}
