/**
 * @file RegisterStore.ts
 *
 * Gère l'enregistrement des utilisateurs et l'ajout des données dans Firestore.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, type DocumentData } from 'firebase/firestore'

/**
 * Gère l'état d'enregistrement d'un utilisateur et l'ajout des données dans Firestore.
 */
export const RegisterStore = defineStore('register', () => {
  // Référence à l'objet utilisateur connecté
  const user: Ref<User | null> = ref(null)

  // Référence aux données supplémentaires de l'utilisateur récupérées depuis Firestore
  const userData: Ref<DocumentData | null> = ref(null)

  // Référence pour stocker les messages d'erreur
  const errorMessage: Ref<string> = ref('')

  // Référence pour l'état de chargement pendant l'enregistrement
  const isLoading: Ref<boolean> = ref(false)

  /**
   * Enregistre un nouvel utilisateur via Firebase Authentication et ajoute ses données dans Firestore.
   *
   * @param {string} lastName - Nom de famille de l'utilisateur.
   * @param {string} firstName - Prénom de l'utilisateur.
   * @param {string} role - Rôle de l'utilisateur.
   * @param {string} email - Email de l'utilisateur.
   * @param {string} password - Mot de passe de l'utilisateur.
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois l'enregistrement réussi ou échoué.
   */
  const register = async (
    lastName: string,
    firstName: string,
    role: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      // Vérifie si l'email est déjà utilisé
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      if (signInMethods.length > 0) {
        // Récupère les données utilisateur depuis Firestore
        const existingUserDocRef = doc(db, 'users', email)
        const userDoc = await getDoc(existingUserDocRef)

        // Modifie le message d'erreur si l'utilisateur est inactif
        if (userDoc.exists() && userDoc.data()?.status === 'inactive') {
          await updateDoc(existingUserDocRef, { status: 'active' })

          errorMessage.value = 'The account has been reactivated.'
          return
        } else {
          // Modifie le message d'erreur si l'email est déjà utilisé
          errorMessage.value = 'Email is already in use.'
          return
        }
      }

      // Crée un nouvel utilisateur avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Récupère l'ID de l'utilisateur
      const uid = userCredential.user.uid

      // Ajoute les données utilisateur dans Firestore
      const userDocRef = doc(db, 'users', uid)
      await setDoc(userDocRef, {
        id: uid,
        lastName,
        firstName,
        role,
        email,
        status: 'active',
      })

      // Récupère les données utilisateur et les stocke dans le store
      userData.value = { lastName, firstName, role, email }
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

  // Retourne l'état utilisateur, les données et les fonctions d'enregistrement
  return { user, userData, errorMessage, isLoading, register }
})
