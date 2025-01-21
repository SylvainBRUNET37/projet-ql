/**
 * @file UserStore.ts
 *
 * Gère les données utilisateur et les actions associées.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import { getDoc, doc, type DocumentData } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

/**
 * Gère l'état et la récupération des informations utilisateur.
 */
export const UserStore = defineStore('user', () => {
  // Référence pour stocker les informations utilisateur
  const userData: Ref<DocumentData | null> = ref(null)
 

  // Référence pour stocker les messages d'erreur
  const errorMessage: Ref<string> = ref('')

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
      sessionStorage.setItem('uid', currentUser.uid);
      // Stocke les données utilisateur dans userData
      if (userDoc.exists()) {
        userData.value = userDoc.data()
        console.log(userData.value)
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

  // Retourne les données utilisateur, les erreurs et la fonction de récupération
  return { userData, errorMessage, getUserData }
})
