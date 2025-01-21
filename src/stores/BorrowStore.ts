import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type DocumentData, addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase' // Assurez-vous que `db` est correctement configuré pour Firestore
import type { promises } from 'dns'

export const BorrowStore = defineStore('borrow', () => {
  // Références réactives
  const borrow: Ref<DocumentData[]> = ref([])
  const errorMessage: Ref<string> = ref('')
  /**
   * Récupère les équipements empruntés par un utilisateur spécifique qui sont actuellement empruntés.
   *
   * @param {string} userId - ID de l'utilisateur.
   * @returns {Promise<DocumentData[]>} - Liste des équipements empruntés actuellement.
   */
  const getUserEquipments = async (userId: string): Promise<DocumentData[]> => {
    try {
      // Récupère les emprunts de l'utilisateur
      const borrowQuery = query(collection(db, 'borrow'), where('userId', '==', userId))
      const borrowSnapshot = await getDocs(borrowQuery)
      const borrowedItems = borrowSnapshot.docs.map((doc) => doc.data())

      // Obtenir la date actuelle
      const currentDate = new Date().getTime() / 1000 // Timestamp UNIX en secondes

      // Filtrer les emprunts qui sont actifs à la date actuelle
      const activeBorrowedItems = borrowedItems.filter(
        (item) => item.borrowDate <= currentDate && item.returnDate >= currentDate,
      )

      // Récupère les ids des équipements empruntés actuellement
      const equipmentIds = activeBorrowedItems.map((item) => item.equipmentId)

      // Vérifie si l'utilisateur a des emprunts actifs
      if (!equipmentIds || equipmentIds.length === 0) {
        return []
      }

      // Récupère les équipements associés aux emprunts actifs
      const equipmentQuery = query(collection(db, 'equipments'), where('id', 'in', equipmentIds))
      const equipmentSnapshot = await getDocs(equipmentQuery)
      const equipments = equipmentSnapshot.docs.map((doc) => doc.data())

      // Associe les emprunts actifs aux équipements
      const result = activeBorrowedItems.map((borrowItem) => ({
        ...borrowItem,
        equipment: equipments.find((equipment) => equipment.id === borrowItem.equipmentId),
      }))

      console.log('Équipements empruntés actuellement:', result)

      return result
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements empruntés:', error)
      errorMessage.value = 'Impossible de récupérer les équipements empruntés.'
      return []
    }
  }

  /**
   * Permet à un utilisateur d'emprunter un matériel pour une durée spécifiée avec une date début qui ne doit pas être inférieur à la date actuelle
   * et ne doit pas dépasser 1 an par rapport à la date actuelle.
   * Une date de fin qui ne doit pas dépasser 6 mois par rapport à la date de début.
   *  
 
   * @param userId string
   * @param equipemntId string
   * @param start string de la date de départ
   * @param end string de la date de fin
   */
  const borrowEquipment = async(userId: string, equipemntId:string, start: string , end: string): Promise<string> => {
    try{
      //caluls des dates
      const currentDate = new Date();
      const startDate = new Date(start);
      const endDate = new Date(end);
      const plusOneYear = new Date(currentDate);
      plusOneYear.setFullYear(currentDate.getFullYear() + 1);

      //vérifie toutes les contraintessur les dates
      if (startDate.getTime() < currentDate.getTime() || startDate.getTime() > plusOneYear.getTime()) {
      
        throw new Error(
          "The start date must not exceed 1 year from the current date and and cannot already have passed "
        );
      }else if(endDate.getTime() > (startDate.setMonth(startDate.getMonth()+ 6))){
        throw new Error(
          "The start date must not exceed 1 year from the current date and and cannot already have passed "
        );
      }else if (endDate.getTime() < startDate.getTime()){
        throw new Error(
          "Start date must be before end date "
        );
      }else if (endDate.getTime() > startDate.setMonth(startDate.getMonth() + 6)){
        throw new Error(
          "Borrowing period must not exceed 6 months "
        );
      }else {
        //emprunt
        await addDoc(collection(db, 'borrow'), {
          userId: userId,
          equipmentId: equipemntId,
          borrowDate: startDate, 
          returnDate: endDate, 
        });
        return "";
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des équipements empruntés:', error);
      return String(error);
    }
  }

  /**
   * @param equipmentId équipement pour lequel on cherche à connaître son status
   * @returns 1=available, 0=borrowed
   * @returns null si erreur lors de la requete
   */
  const getEquipmentStatus = async(equipmentId: String): Promise<number | null> => {
      try{
        const borrowCollection = collection(db, "borrow");
        const q = query(borrowCollection,where("equipmentId", "==", equipmentId)) // Filtre par l'ID de l'équipement
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) { 
          // l'equipement correspondant à cet id n'est pas emprunté
          return 1
        } else {
          // l'equipement correspondant à cet id est emprunté
         return 0;
        }
      }catch (error) {
        console.error('Erreur de connexion à la bdd:', error);
        return null;
      }
  }

  return {
    borrow,
    errorMessage,
    getUserEquipments,
    borrowEquipment,
    getEquipmentStatus,
  }
})
