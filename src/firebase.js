// Firebase Configuration for Zaidi Ya Misuli
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5qLyjxv6-NONV5tx9lNRj56n_qFoYBqc",
    authDomain: "zaidi-ya-misuli.firebaseapp.com",
    projectId: "zaidi-ya-misuli",
    storageBucket: "zaidi-ya-misuli.firebasestorage.app",
    messagingSenderId: "134312388587",
    appId: "1:134312388587:web:8e9cbdf2f9328245b89bae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Helper to fetch content for a specific page from Firestore.
 */
export async function fetchContent(pageId) {
    try {
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'content', pageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null; // Fallback handled by frontend
    } catch (e) {
        console.error("Error fetching content:", e);
        return null;
    }
}

export default app;
