import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Assurez-vous que votre configuration Firebase est correcte

// Fonction pour récupérer les utilisateurs depuis Firestore
export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    throw error;
  }
}

// Fonction pour changer le statut d'un utilisateur
export async function changeUserStatus(id, currentStatus) {
  try {
    const userDoc = doc(db, 'users', id); // Référence au document de l'utilisateur
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Bascule entre "active" et "inactive"
    await updateDoc(userDoc, { status: newStatus }); // Met à jour le statut dans Firestore
  } catch (error) {
    console.error('Erreur lors du changement de statut de l\'utilisateur :', error);
    throw error;
  }
}
