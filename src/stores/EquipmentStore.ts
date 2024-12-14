/**
 * @file EquipmentStore.ts
 *
 * Gère la récupération et le suivi des équipements empruntés depuis Firebase.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, type DocumentData } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

/**
 * Gère l'état et la récupération des équipements.
 */
export const EquipmentStore = defineStore('equipment', () => {
  // Référence pour stocker la liste des équipements
  const equipment: Ref<DocumentData[]> = ref([])

  // Référence pour stocker les messages d'erreur
  const errorMessage: Ref<string> = ref('')

  /**
   * Récupère tous les équipements depuis Firestore.
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois les données récupérées ou en cas d'erreur.
   */
  const getAllEquipment = async (): Promise<void> => {
    try {
      // Récupère les données des équipements depuis Firestore
      const querySnapshot = await getDocs(collection(db, 'equipments'))
      equipment.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      errorMessage.value = ''
    } catch (error: FirebaseError | unknown) {
      // Gestion des erreurs Firebase
      if (error instanceof FirebaseError) {
        errorMessage.value = 'An error occurred while fetching equipment.'
        console.error(error)
      } else {
        errorMessage.value = 'Internal error, please try again later.'
        console.error(error)
      }
    }
  }

  /**
   * Récupère les équipements empruntés par un utilisateur spécifique.
   *
   * @param {string} userId - ID de l'utilisateur.
   * @returns {DocumentData[]} - Liste des équipements empruntés.
   */
  const getUserEquipments = (userId: string): DocumentData[] => {
    return equipment.value.filter((item) => item.BorrowedId === userId)
  }

  // Retourne les équipements, les erreurs et les fonctions
  return { equipment, errorMessage, getAllEquipment, getUserEquipments }
})
