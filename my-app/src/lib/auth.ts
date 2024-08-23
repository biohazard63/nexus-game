import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const addSession = async () => {
    try {
        await addDoc(collection(db, 'sessions'), {
            name: 'Nouvelle Session',
            hostId: 'user-id',
            startTime: new Date(),
            location: 'Paris',
        });
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};
