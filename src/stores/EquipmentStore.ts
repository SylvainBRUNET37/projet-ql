/**
 * @file EquipmentStore.ts
 *
 * Gère la récupération et le suivi des équipements empruntés depuis Firebase.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, deleteDoc, doc, type DocumentData, addDoc } from 'firebase/firestore'
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
      // Modifie le message d'erreur en fonction du type d'erreur
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage.value = 'Service temporarily unavailable, please try again later.'
            break
          case 'auth/timeout':
            errorMessage.value = 'No connection, please check your network.'
            break
          case 'auth/invalid-credential':
            errorMessage.value = 'Incorrect email or password.'
            break
          default:
            errorMessage.value = 'Internal error, please try again later.'
        }
      } else {
        // Gestion d'autres types d'erreurs
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

  /**
   * Supprime un équipement à partir de son ID.
   *
   * @param {string} equipmentId - ID de l'équipement à supprimer.
   * @returns {Promise<void>} - Promesse qui se résout une fois l'équipement supprimé ou en cas d'erreur.
   */
  const deleteEquipment = async (equipmentId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'equipments', equipmentId))
      // Met à jour la liste locale après suppression
      equipment.value = equipment.value.filter((item) => item.id !== equipmentId)
      errorMessage.value = ''
    } catch (error: FirebaseError | unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'not-found':
            errorMessage.value = 'Equipment not found.'
            break
          default:
            errorMessage.value = 'Failed to delete equipment. Please try again later.'
        }
      } else {
        errorMessage.value = 'Failed to delete equipment. Please try again later.'
        console.error(error)
      }
    }
  }

  /**
   * Ajoute un nouvel équipement dans Firestore.
   *
   * @param {object} newEquipment - Détails du nouvel équipement.
   * @returns {Promise<void>} - Promesse résolue une fois l'équipement ajouté.
   */
  const addEquipment = async (newEquipment: DocumentData): Promise<void> => {
    try {
      alert(newEquipment)
      const equipmentRef = collection(db, 'equipments')
      await addDoc(equipmentRef, newEquipment)
      // Mettre à jour la liste locale après ajout
      await getAllEquipment()
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement :", error)
    }
  }

  // Retourne les équipements, les erreurs et les fonctions
  return {
    equipment,
    errorMessage,
    getAllEquipment,
    getUserEquipments,
    deleteEquipment,
    addEquipment,
  }
})
