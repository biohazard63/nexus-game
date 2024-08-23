import { db } from './firebase'; // Assurez-vous que le chemin est correct
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

// Fonction pour ajouter un document dans une collection
export async function addDocument(collectionName: string, data: any) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log('Document ajouté avec ID : ', docRef.id);
        return { id: docRef.id, ...data };
    } catch (e) {
        console.error('Erreur lors de l’ajout du document : ', e);
        throw e;
    }
}

// Fonction pour récupérer tous les documents d'une collection
export async function getDocuments(collectionName: string) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return documents;
    } catch (e) {
        console.error('Erreur lors de la récupération des documents : ', e);
        throw e;
    }
}

// Fonction pour récupérer un document spécifique par ID
export async function getDocumentById(collectionName: string, id: string) {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.error('Aucun document trouvé avec cet ID');
            return null;
        }
    } catch (e) {
        console.error('Erreur lors de la récupération du document : ', e);
        throw e;
    }
}

// Fonction pour mettre à jour un document par ID
export async function updateDocument(collectionName: string, id: string, data: any) {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        console.log('Document mis à jour avec succès');
        return { id, ...data };
    } catch (e) {
        console.error('Erreur lors de la mise à jour du document : ', e);
        throw e;
    }
}

// Fonction pour supprimer un document par ID
export async function deleteDocument(collectionName: string, id: string) {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        console.log('Document supprimé avec succès');
        return true;
    } catch (e) {
        console.error('Erreur lors de la suppression du document : ', e);
        throw e;
    }
}
