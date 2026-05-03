import { collection, query, orderBy, limit, addDoc, serverTimestamp, getDocs, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseCore";
import { PostMural, ComentarioPost } from "../types";

export const muralCol = collection(db, "mural");

export const getMuralPosts = async (limitCount: number = 20): Promise<PostMural[]> => {
    const q = query(muralCol, orderBy("criadoEm", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
        const data = d.data();
        return {
            ...data,
            id: d.id,
            criadoEm: data.criadoEm?.toDate() || new Date(),
            comentarios: (data.comentarios || []).map((c: any) => ({
                ...c,
                criadoEm: c.criadoEm?.toDate() || new Date(),
                curtidas: c.curtidas || []
            }))
        } as PostMural;
    });
};

export const createPost = async (post: Omit<PostMural, "id" | "criadoEm">): Promise<string> => {
    const docRef = await addDoc(muralCol, {
        ...post,
        criadoEm: serverTimestamp(),
        comentarios: [],
        curtidas: [],
        visivel: true,
        fixado: post.fixado || false
    });
    return docRef.id;
};

export const toggleLikePost = async (postId: string, userId: string, hasLiked: boolean): Promise<void> => {
    const postRef = doc(db, "mural", postId);
    await updateDoc(postRef, {
        curtidas: hasLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
};

export const addCommentToPost = async (postId: string, comment: Omit<ComentarioPost, "id" | "criadoEm" | "curtidas">): Promise<ComentarioPost> => {
    const postRef = doc(db, "mural", postId);
    const commentId = Math.random().toString(36).substring(2, 9);
    const novoComentario = {
        ...comment,
        id: commentId,
        criadoEm: new Date(),
        curtidas: []
    };
    await updateDoc(postRef, {
        comentarios: arrayUnion(novoComentario)
    });
    return novoComentario;
};

export const toggleLikeComment = async (postId: string, commentId: string, userId: string, hasLiked: boolean): Promise<void> => {
    const postRef = doc(db, "mural", postId);
    const snap = await getDocs(query(muralCol)); // Note: This is inefficient but arrayUnion/Remove with nested objects is tricky in Firestore
    // For simplicity in this demo/proto, we fetch, update locally, and save back the whole array
    // In production, we'd use a subcollection for comments or a more complex atomic update.
    const postDoc = snap.docs.find(d => d.id === postId);
    if (!postDoc) return;
    
    const data = postDoc.data();
    const novosComentarios = (data.comentarios || []).map((c: any) => {
        if (c.id === commentId) {
            const novasCurtidas = hasLiked 
                ? (c.curtidas || []).filter((id: string) => id !== userId)
                : [...(c.curtidas || []), userId];
            return { ...c, curtidas: novasCurtidas };
        }
        return c;
    });

    await updateDoc(postRef, { comentarios: novosComentarios });
};

export const deleteCommentFromPost = async (postId: string, comment: ComentarioPost): Promise<void> => {
    const postRef = doc(db, "mural", postId);
    await updateDoc(postRef, {
        comentarios: arrayRemove(comment)
    });
};

export const deletePost = async (postId: string): Promise<void> => {
    const postRef = doc(db, "mural", postId);
    await deleteDoc(postRef);
};

export const togglePinPost = async (postId: string, isPinned: boolean): Promise<void> => {
    const postRef = doc(db, "mural", postId);
    await updateDoc(postRef, {
        fixado: !isPinned
    });
};
