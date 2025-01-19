import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type DocumentData, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase' // Assurez-vous que `db` est correctement configuré pour Firestore

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

  return {
    borrow,
    errorMessage,
    getUserEquipments,
  }
})
