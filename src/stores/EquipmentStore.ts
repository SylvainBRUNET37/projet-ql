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
  setDoc,
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
   * Vérifie si un équipement a un emprunt actif.
   *
   * @param {string} equipmentId - ID de l'équipement.
   * @returns {Promise<boolean>} - Retourne `true` si l'équipement peut être supprimé, sinon demande une confirmation.
   */
  const canDeleteEquipment = async (equipmentId: string): Promise<boolean> => {
    try {
      // Récupère tous les emprunts liés
      const borrowQuery = query(collection(db, 'borrow'), where('equipmentId', '==', equipmentId))
      const borrowSnapshots = await getDocs(borrowQuery)

      // Vérifie s'il y a un emprunt en cours
      const now = Date.now()
      const activeBorrow = borrowSnapshots.docs.some(
        (borrowDoc) => borrowDoc.data().returnDate > now,
      )

      // Demande confirmation si un emprunt est actif
      if (activeBorrow) {
        return confirm(
          'This equipment is still borrowed. Do you still want to continue the action?',
        )
      }

      return true
    } catch (error) {
      console.error('Error :', error)
      return false
    }
  }

  /**
   * Supprime un équipement et tous ses emprunts liés à partir de son ID.
   *
   * @param {string} equipmentId - ID de l'équipement à supprimer.
   * @returns {Promise<void>} - Promesse qui se résout une fois l'équipement supprimé ou en cas d'erreur.
   */
  const deleteEquipment = async (equipmentId: string): Promise<void> => {
    try {
      // Vérifie si l'équipement peut être supprimé
      const canDelete = await canDeleteEquipment(equipmentId)
      if (!canDelete) return

      // Récupère les emprunts liés
      const borrowQuery = query(collection(db, 'borrow'), where('equipmentId', '==', equipmentId))
      const borrowSnapshots = await getDocs(borrowQuery)

      // Supprime tous les emprunts liés
      const deletePromises = borrowSnapshots.docs.map((borrowDoc) =>
        deleteDoc(doc(db, 'borrow', borrowDoc.id)),
      )
      await Promise.all(deletePromises)

      // Supprime l'équipement
      await deleteDoc(doc(db, 'equipments', equipmentId))

      // Met à jour la liste locale
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
   * Met à jour le statut d'un équipement. Si le status passe à unavailable, les emprunts en cours et futurs sont supprimés.
   *
   * @param {string} equipmentId - ID de l'équipement à mettre à jour.
   * @param {string} currentStatus - Le statut actuel de l'équipement ('available' ou 'unavailable').
   * @returns {Promise<void>} - Promesse qui se résout une fois le statut mis à jour ou en cas d'erreur.
   */
  const updateEquipmentStatus = async (
    equipmentId: string,
    currentStatus: string,
  ): Promise<void> => {
    try {
      // Vérifie si on passe de "available" à "unavailable"
      if (currentStatus === 'available') {
        // Vérifie si l'équipement peut être modifié
        const canModify = await canDeleteEquipment(equipmentId)
        if (!canModify) {
          alert('Equipment is already borrowed by a user')
          return
        }
      }

      // Référence au document de l'équipement dans Firestore
      const equipmentDocRef = doc(db, 'equipments', equipmentId)

      // Détermine le nouveau statut
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available'

      // Mise à jour du champ "status"
      await updateDoc(equipmentDocRef, { status: newStatus })

      // Mise à jour de la liste locale après modification du statut
      equipment.value = equipment.value.map((item) =>
        item.id === equipmentId ? { ...item, status: newStatus } : item,
      )

      // Réinitialisation du message d'erreur
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
   * Récupère les équipements disponibles (status "available").
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois le statut mis à jour ou en cas d'erreur.
   */
  const getAvailableEquipments = async (): Promise<void> => {
    // Référence à la collection des équipements
    const equipmentCollection = collection(db, 'equipments')

    // Requête pour récupérer les équipements disponibles
    const q = query(equipmentCollection, where('status', '==', 'available'))
    try {
      // Récupère les équipements disponibles
      const querySnapshot = await getDocs(q)
      equipment.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
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
   * Ajoute un nouvel équipement dans Firestore avec l'ID stocké comme champ dans le document.
   *
   * @param {object} newEquipment - Détails du nouvel équipement.
   * @returns {Promise<void>} - Promesse résolue une fois l'équipement ajouté.
   */
  const addEquipment = async (newEquipment: DocumentData): Promise<void> => {
    try {
      // Ajoute le lien de l'image en fonction du type
      switch (newEquipment.type) {
        case 'phone':
          newEquipment.image = 'phone.png'
          break
        case 'laptop':
          newEquipment.image = 'laptop.jpg'
          break
        case 'mouse':
          newEquipment.image = 'mouse.jpg'
          break
        case 'computer':
          newEquipment.image = 'computer.jpg'
          break
        default:
          newEquipment.image = 'unknown.png'
      }

      // Génère une référence unique pour chaque équipement
      let randomNumber: number
      let uniqueRef: string

      // Boucle pour générer une nouvelle référence tant qu'elle existe déjà dans Firestore
      do {
        randomNumber = Math.floor(Math.random() * 10000)
        uniqueRef = `${newEquipment.ref}-${randomNumber}`
      } while (await doesRefExist(uniqueRef))

      // Met à jour l'équipement avec la nouvelle ref
      newEquipment.ref = uniqueRef

      // Ajoute le nouvel équipement dans Firestore
      const docRef = await addDoc(collection(db, 'equipments'), {
        ...newEquipment,
        id: '',
      })

      // Met à jour l'ID de l'équipement dans Firestore
      await setDoc(docRef, { ...newEquipment, id: docRef.id })
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
    deleteEquipment,
    addEquipment,
    updateEquipmentStatus,
    getAvailableEquipments,
  }
})
