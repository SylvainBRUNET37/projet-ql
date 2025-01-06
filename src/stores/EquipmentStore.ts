/**
 * @file EquipmentStore.ts
 *
 * Gère la récupération et le suivi des équipements empruntés depuis Firebase.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  type DocumentData,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
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
   * Met à jour le statut d'un équipement à "unavailable".
   *
   * @param {string} equipmentId - ID de l'équipement à mettre à jour.
   * @returns {Promise<void>} - Promesse qui se résout une fois le statut mis à jour ou en cas d'erreur.
   */
  const disableEquipment = async (equipmentId: string): Promise<void> => {
    try {
      // Référence au document de l'équipement dans Firestore
      const equipmentDocRef = doc(db, 'equipments', equipmentId)

      // Mise à jour du champ "status" à "unavailable"
      await updateDoc(equipmentDocRef, {
        status: 'unavailable',
      })

      // Met à jour la liste locale après modification du statut
      equipment.value = equipment.value.map((item) =>
        item.id === equipmentId ? { ...item, status: 'unavailable' } : item,
      )
      errorMessage.value = ''
    } catch (error: FirebaseError | unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'not-found':
            errorMessage.value = 'Equipment not found.'
            break
          default:
            errorMessage.value = 'Failed to update equipment status. Please try again later.'
        }
      } else {
        errorMessage.value = 'Failed to update equipment status. Please try again later.'
        console.error(error)
      }
    }
  }

  /**
   * Met à jour le statut d'un équipement à "available".
   *
   * @param {string} equipmentId - ID de l'équipement à mettre à jour.
   * @returns {Promise<void>} - Promesse qui se résout une fois le statut mis à jour ou en cas d'erreur.
   */
  const enableEquipment = async (equipmentId: string): Promise<void> => {
    try {
      // Référence au document de l'équipement dans Firestore
      const equipmentDocRef = doc(db, 'equipments', equipmentId);

      // Mise à jour du champ "status" à "available"
      await updateDoc(equipmentDocRef, {
        status: 'available',
      });

      // Met à jour la liste locale après modification du statut
      equipment.value = equipment.value.map((item) =>
        item.id === equipmentId ? { ...item, status: 'available' } : item,
      );
      errorMessage.value = '';
    } catch (error: FirebaseError | unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'not-found':
            errorMessage.value = 'Equipment not found.';
            break;
          default:
            errorMessage.value =
              'Failed to update equipment status. Please try again later.';
        }
      } else {
        errorMessage.value =
          'Failed to update equipment status. Please try again later.';
        console.error(error);
      }
    }
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
      let randomNumber: number
      let uniqueRef: string

      // Boucle pour générer une nouvelle référence tant qu'elle existe déjà dans Firestore
      do {
        randomNumber = Math.floor(Math.random() * 10000)
        uniqueRef = `${newEquipment.ref}-${randomNumber}`
      } while (await doesRefExist(uniqueRef))

      // Met à jour l'equipement avec la nouvelle ref
      newEquipment.ref = uniqueRef

      // Ajouter le lien de l'image en fonction du type
      switch (newEquipment.type) {
        case 'phone':
          newEquipment.image = 'phone.png'
          break
        case 'laptop':
          newEquipment.image = 'laptop.jpg'
          break
        case 'mouse ':
          newEquipment.image = 'mouse.jpg'
          break
        case 'computer':
          newEquipment.image = 'computer.jpg'
          break
        default:
          newEquipment.image = 'unknown.png'
      }

      const equipmentRef = collection(db, 'equipments')
      await addDoc(equipmentRef, newEquipment)
      // Mettre à jour la liste locale après ajout
      await getAllEquipment()
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement :", error)
    }
  }

  /**
   * Vérifie si une référence existe déjà dans Firestore.
   *
   * @param {string} ref - La référence à vérifier.
   * @returns {Promise<boolean>} - Renvoie true si la référence existe déjà, sinon false.
   */
  const doesRefExist = async (ref: string): Promise<boolean> => {
    const equipmentRef = collection(db, 'equipments')
    const q = query(equipmentRef, where('ref', '==', ref))
    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty
  }

  // Retourne les équipements, les erreurs et les fonctions
  return {
    equipment,
    errorMessage,
    getAllEquipment,
    getUserEquipments,
    deleteEquipment,
    addEquipment,
    disableEquipment,
    enableEquipment,
  }
})
