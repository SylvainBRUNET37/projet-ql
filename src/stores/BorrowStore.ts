import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type DocumentData, addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import { handleFirebaseError } from '../utils/ErrorHandler'
import { FirebaseError } from 'firebase/app'

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
  const getUserBorrowedEquipments = async (userId: string): Promise<DocumentData[]> => {
    try {
      // Récupère les emprunts de l'utilisateur
      const borrowQuery = query(collection(db, 'borrow'), where('userId', '==', userId))
      const borrowSnapshot = await getDocs(borrowQuery)
      const borrowedItems = borrowSnapshot.docs.map((doc) => doc.data())

      // Obtenir la date actuelle
      const currentDate = new Date().getTime()

      // Filtrer les emprunts qui sont actifs à la date actuelle
      const activeBorrowedItems = borrowedItems.filter((item) => item.returnDate >= currentDate)

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
      handleFirebaseError(error, errorMessage)
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
   * @param start number de la date de départ
   * @param end number de la date de fin
   */
  const borrowEquipment = async (
    userId: string,
    equipemntId: string,
    start: number,
    end: number,
  ): Promise<void> => {
    try {
      // Date actuelle en millisecondes (number)
      const currentDate = roundDayUTC(new Date())
      const oneYearLater = currentDate + 365 * 24 * 60 * 60 * 1000 // +1 an
      const sixMonthsInMillis = Math.floor((365 * 24 * 60 * 60 * 1000) / 2) // 6 mois

      // dates round on hours because start < currentDate will alway be true on UTC format with milisecondes
      const startDate = roundDayUTC(new Date(start))
      const endDate = roundDayUTC(new Date(end))

      // Vérifications des contraintes sur les dates
      if (startDate < currentDate) {
        errorMessage.value = 'The start date cannot be in the past.'
        return
      }

      if (startDate > oneYearLater) {
        errorMessage.value = 'The start date must not exceed 1 year from the current date.'
        return
      }

      if (endDate < startDate) {
        errorMessage.value = 'The end date must be after the start date.'
        return
      }

      if (endDate > startDate + sixMonthsInMillis) {
        errorMessage.value = 'The borrowing period must not exceed 6 months.'
        return
      }
      if (start == null || end == null) {
        errorMessage.value = 'Start and end dates must be valid timestamps.'
        return
      }

      const status = await getEquipmentStatusPeriod(equipemntId, startDate, endDate)
      console.log('Status du retour : ', status)

      // Si l'équipement est déjà emprunté pendant cette période, affiche un message d'erreur
      if (status === -1) {
        return
      } else if (status === 0) {
        console.log('Déjà emprunté pendant cette période!')
        errorMessage.value = 'Equipment is already on loan during this period'
        return
      }

      console.log('Pas déjà emprunté pendant cette période!')

      // Ajout de l'emprunt dans Firestore
      await addDoc(collection(db, 'borrow'), {
        userId: userId,
        equipmentId: equipemntId,
        borrowDate: start,
        returnDate: end,
      })
    } catch (error) {
      handleFirebaseError(error, errorMessage)
    }
  }

  const roundDayUTC = (date: Date): number => {
    date.setUTCHours(0, 0, 0, 0) // Resets also seconds and milliseconds
    return date.getTime()
  }

  /**
   * @param equipmentId équipement pour lequel on cherche à connaître son status
   * @returns 1=available, 0=borrowed
   * @returns null si erreur lors de la requete
   */
  const getEquipmentStatus = async (equipmentId: string): Promise<number | null> => {
    try {
      const borrowCollection = collection(db, 'borrow')
      const q = query(borrowCollection, where('equipmentId', '==', equipmentId)) // Filtre par l'ID de l'équipement
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        // l'equipement correspondant à cet id n'est pas emprunté
        return 1
      } else {
        // l'equipement correspondant à cet id est emprunté
        return 0
      }
    } catch (error) {
      handleFirebaseError(error, errorMessage)
      return null
    }
  }

  /**
   * Vérifie si un équipement est emprunté sur une période donnée.
   * @param equipmentId - ID de l'équipement à vérifier.
   * @param borrowDate - Date de début de l'emprunt (timestamp en ms).
   * @param returnDate - Date de fin de l'emprunt (timestamp en ms).
   * @returns {Promise<number>} - 1 = disponible, 0 = emprunté, -1 = erreur.
   */
  const getEquipmentStatusPeriod = async (
    equipmentId: string,
    borrowDate: number,
    returnDate: number,
  ): Promise<number> => {
    try {
      const borrowCollection = collection(db, 'borrow')

      // Crée la requête pour récupérer tous les emprunts de l'équipement
      const q = query(borrowCollection, where('equipmentId', '==', equipmentId))

      // Exécute la requête
      const querySnapshot = await getDocs(q)

      // Si l'équipement n'a pas d'emprunts, il est disponible
      if (querySnapshot.empty) {
        return 1
      }

      // Parcours tous les emprunts pour vérifier s'il y a un chevauchement avec la période donnée
      for (const doc of querySnapshot.docs) {
        const data = doc.data()
        const currentBorrowDate = data.borrowDate
        const currentReturnDate = data.returnDate

        // Vérifie si l'emprunt chevauche la période donnée
        if (currentBorrowDate <= returnDate && currentReturnDate >= borrowDate) {
          return 0 // L'équipement est déjà emprunté pendant cette période
        }
      }

      // Si aucun emprunt n'emmêle, l'équipement est disponible
      return 1
    } catch (error) {
      // Affiche l'erreur dans la console pour débogage
      console.error('Erreur dans getEquipmentStatusPeriod:', error.message, error.code)
      handleFirebaseError(error, errorMessage)

      // Retourne -1 en cas d'erreur (comme une erreur de connexion ou de requête Firebase)
      return -1
    }
  }

  return {
    borrow,
    errorMessage,
    getUserBorrowedEquipments,
    borrowEquipment,
    getEquipmentStatus,
    roundDayUTC,
  }
})
