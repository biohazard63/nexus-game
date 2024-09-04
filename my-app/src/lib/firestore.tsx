import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    where,
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

// Nouvelle fonction pour récupérer toutes les données de l'utilisateur et ses relations
export async function getUserData(userId: string) {
    try {
        // Récupérer les informations principales de l'utilisateur depuis la collection "users"
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('Utilisateur non trouvé');
        }

        const userData = userDoc.data();

        // Récupérer les relations de l'utilisateur
        const groupsQuery = query(collection(db, 'groups'), where('members', 'array-contains', userId));
        const groupsSnapshot = await getDocs(groupsQuery);
        const groups = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));
        const commentsSnapshot = await getDocs(commentsQuery);
        const comments = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const ratingsQuery = query(collection(db, 'ratings'), where('userId', '==', userId));
        const ratingsSnapshot = await getDocs(ratingsQuery);
        const ratings = ratingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const rewardsQuery = query(collection(db, 'rewards'), where('userId', '==', userId));
        const rewardsSnapshot = await getDocs(rewardsQuery);
        const rewards = rewardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const wishlistQuery = query(collection(db, 'wishlists'), where('userId', '==', userId));
        const wishlistSnapshot = await getDocs(wishlistQuery);
        const wishlists = wishlistSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const invitationsSentQuery = query(collection(db, 'invitations'), where('inviterId', '==', userId));
        const invitationsReceivedQuery = query(collection(db, 'invitations'), where('inviteeId', '==', userId));

        const invitationsSentSnapshot = await getDocs(invitationsSentQuery);
        const invitationsReceivedSnapshot = await getDocs(invitationsReceivedQuery);

        const invitationsSent = invitationsSentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const invitationsReceived = invitationsReceivedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Retourner toutes les données dans un objet
        return {
            ...userData,
            groups,
            comments,
            ratings,
            rewards,
            wishlists,
            invitationsSent,
            invitationsReceived,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        throw error;
    }
}