/**
 * @file UserStore.ts
 *
 * Gère les données utilisateur et les actions associées.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import {
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  collection,
  type DocumentData,
  query,
  where,
  setDoc,
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

/**
 * Gère l'état et la récupération des informations utilisateur.
 */
export const UserStore = defineStore('user', () => {
  // Référence pour stocker les informations utilisateur
  const userData: Ref<DocumentData | null> = ref(null)
  const users: Ref<DocumentData[]> = ref([])

  // Référence pour stocker les messages d'erreur
  const errorMessage: Ref<string> = ref('')

  /**
   * Vérifie si un utilisateur peut être supprimé et gère tous ses emprunts.
   *
   * @param {string} userId - L'ID de l'utilisateur.
   * @returns {Promise<boolean>} - Retourne `true` si la suppression peut continuer, sinon `false`.
   */
  const canDeleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Récupère tous les emprunts liés
      const borrowQuery = query(collection(db, 'borrow'), where('userId', '==', userId))
      const borrowSnapshots = await getDocs(borrowQuery)

      // Vérifie s'il y a un emprunt en cours ou futur
      const now = Date.now()
      const activeBorrow = borrowSnapshots.docs.some(
        (borrowDoc) => borrowDoc.data().returnDate > now,
      )

      // Retourne true si un emprunt actif est trouvé sinon false
      if (activeBorrow) return false
      else return true
    } catch (error) {
      console.error("Erreur lors de la vérification des emprunts de l'utilisateur :", error)
      errorMessage.value = 'Erreur interne, veuillez réessayer plus tard.'
      return false
    }
  }

  /**
   * Supprime un utilisateur de Firestore à partir de son ID.
   *
   * @param {string} userId - L'ID de l'utilisateur à supprimer.
   * @returns {Promise<void>} - Promesse qui se résout une fois l'utilisateur supprimé ou en cas d'erreur.
   */
  const deleteUserById = async (userId: string): Promise<void> => {
    try {
      // Vérifie que l'administrateur ne supprime pas son propre compte
      const currentUserId = auth.currentUser?.uid
      if (currentUserId === userId) {
        alert('You cannot delete yourself')
        return
      }

      // Vérifie si l'ID de l'utilisateur est fourni
      if (!userId) {
        errorMessage.value = 'User ID is required.'
        return
      }

      // Référence au document de l'utilisateur dans Firestore
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      // Vérifie si l'utilisateur existe
      if (!userDoc.exists()) {
        errorMessage.value = 'User not found.'
        return
      }

      // Vérifie les emprunts avant suppression
      const canDelete = await canDeleteUser(userId)
      if (canDelete === false) {
        // Demande de confirmation pour supprimer l'utilisateur
        const confirmDelete = confirm(
          'The user has outstanding borrows, are you sure you want to delete him?',
        )
        if (!confirmDelete) return
      }

      // Récupère tous les emprunts liés à cet utilisateur
      const borrowQuery = query(collection(db, 'borrow'), where('userId', '==', userId))
      const borrowsSnapshot = await getDocs(borrowQuery)
      const borrowIds: string[] = []

      // Récupère les ID des emprunts de l'utilisateur
      borrowsSnapshot.forEach((doc) => {
        borrowIds.push(doc.id)
      })

      // Supprime tous les emprunts liés à l'utilisateur
      const deletePromises = borrowIds.map((borrowId) => deleteDoc(doc(db, 'borrow', borrowId)))
      await Promise.all(deletePromises)

      // Supprime l'utilisateur de Firestore
      await deleteDoc(userDocRef)
      errorMessage.value = ''
    } catch (error: FirebaseError | unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage.value = 'Service temporarily unavailable, please try again later.'
            break
          default:
            errorMessage.value = 'Internal error, please try again later.'
        }
      } else {
        errorMessage.value = 'Internal error, please try again later.'
        console.error(error)
      }
    }
  }

  /**
   * Met à jour le statut d'un utilisateur dans Firestore.
   *
   * @param {string} userId - ID de l'utilisateur à mettre à jour.
   * @param {string} currentStatus - Le statut actuel de l'utilisateur ('active' ou 'inactive').
   * @returns {Promise<void>} - Promesse qui se résout une fois le statut mis à jour ou en cas d'erreur.
   */
  const updateUserStatus = async (userId: string, currentStatus: string): Promise<void> => {
    try {
      // Vérifie que l'administrateur ne modifie pas son propre statut
      const currentUserId = auth.currentUser?.uid
      if (currentUserId === userId) {
        alert('You cannot desativate yourself')
        return
      }

      // Vérifie si on passe de "active" à "inactive"
      if (currentStatus === 'active') {
        // Vérifie si l'utilsiateur peut être modifié
        const canModify = await canDeleteUser(userId)

        // Empêche la modification si l'utilisateur un emprunt actif
        if (canModify === false) {
          alert('The user has outstanding borrows')
          return
        }
      }

      // Référence au document de l'utilisateur dans Firestore
      const userDocRef = doc(db, 'users', userId)
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

      // Mise à jour du champ "status"
      await updateDoc(userDocRef, {
        status: newStatus,
      })

      // Mise à jour locale des données
      if (userData.value?.id === userId) {
        userData.value = { ...userData.value, status: newStatus }
      }
      errorMessage.value = ''
    } catch (error: FirebaseError | unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'not-found':
            errorMessage.value = 'User not found.'
            break
          default:
            errorMessage.value = 'Failed to update user status. Please try again later.'
        }
      } else {
        errorMessage.value = 'Failed to update user status. Please try again later.'
        console.error(error)
      }
    }
  }

  // Fonction pour récupérer les utilisateurs depuis Firestore
  const getUsers = async (): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      users.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error)
    }
  }

  /**
   * Récupère les informations de l'utilisateur connecté.
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois les données récupérées ou en cas d'erreur.
   */
  const getUserData = async (): Promise<void> => {
    try {
      // Vérifie si un utilisateur est connecté
      const currentUser = auth.currentUser
      if (!currentUser) {
        errorMessage.value = 'No user is logged in.'
        return
      }

      // Récupère les informations utilisateur depuis Firestore
      const userDocRef = doc(db, 'users', currentUser.uid)
      const userDoc = await getDoc(userDocRef)

      // Stocke les données utilisateur dans userData
      if (userDoc.exists()) {
        userData.value = userDoc.data()
        errorMessage.value = ''
      } else {
        errorMessage.value = 'User not found.'
      }
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

  const getUserId = (): string | null => {
    // Vérifie si un utilisateur est connecté
    const currentUser = auth.currentUser
    if (currentUser) {
      return currentUser.uid
    } else {
      errorMessage.value = 'No user is logged in.'
      return null
    }
  }

  const updateUser = async (
    userDataOld: DocumentData,
    userDataNew: DocumentData,
  ): Promise<void> => {
    try {
      console.log('OLD : ', userDataOld.email, 'NEW : ', userDataNew.email)
      if (userDataOld.email !== userDataNew.email) {
        const usersRef = collection(db, 'users')
        const emailQuery = query(usersRef, where('email', '==', userDataNew.email))
        const querySnapshot = await getDocs(emailQuery)

        if (!querySnapshot.empty) {
          errorMessage.value = 'This email is already in use. Please use a different email.'
          return
        }
      }
      const userDocRef = doc(db, 'users', userDataOld.id)
      await setDoc(userDocRef, userDataNew, { merge: true })
      errorMessage.value = ''
      return // Met à jour uniquement les champs modifiés
    } catch (error: FirebaseError | unknown) {
      // Gestion des erreurs
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage.value = 'Service temporarily unavailable, please try again later.'
            break
          default:
            errorMessage.value = 'Internal error, please try again later.'
        }
      } else {
        errorMessage.value = 'Internal error, please try again later.'
        console.error(error)
      }
    }
  }
  const getUserById = async (userId: string) => {
    try {
      console.log('DANS STORE : USER ID ', userId)
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        userData.value = { id: docSnap.id, ...docSnap.data() }
        console.error('User not found')
      }
    } catch (error) {
      console.error('Error getting user data:', error)
    }
  }
  // Retourne les données utilisateur, les erreurs et la fonction de récupération
  return {
    userData,
    errorMessage,
    getUserData,
    deleteUserById,
    getUserId,
    updateUserStatus,
    getUsers,
    users,
    updateUser,
    getUserById,
  }
})
