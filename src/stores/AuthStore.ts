/**
 * @file AuthStore.ts
 *
 * Gère l'authentification et la récupération des données utilisateur via Firebase.
 */

import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc, type DocumentData } from 'firebase/firestore'

/**
 * Gère l'état utilisateur et les actions d'authentification.
 */
export const AuthStore = defineStore('auth', () => {
  // Référence à l'objet utilisateur connecté
  const user: Ref<User | null> = ref(null)

  // Référence aux données supplémentaires de l'utilisateur récupérées depuis Firestore
  const userData: Ref<DocumentData | null> = ref(null)

  // Référence pour stocker les messages d'erreur
  const errorMessage: Ref<string> = ref('')

  /**
   * Connecte un utilisateur via Firebase Authentication.
   *
   * @param {string} email - Adresse e-mail de l'utilisateur.
   * @param {string} password - Mot de passe de l'utilisateur.
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois la connexion réussie ou échouée.
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Connecte l'utilisateur avec Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Récupère l'UID de l'utilisateur connecté
      const uid = userCredential.user.uid

      // Récupère les données utilisateur depuis Firestore (status, role, etc.)
      const userDocRef = doc(db, 'users', uid)
      const userDocSnap = await getDoc(userDocRef)

      // Stocke les données utilisateur dans l'état userData
      if (userDocSnap.exists()) {
        userData.value = userDocSnap.data()

        // Réinitialise le message d'erreur en cas de succès
        errorMessage.value = ''
      } else {
        // Modifie le message d'erreur si les données utilisateur ne sont pas trouvées
        errorMessage.value = 'Incorrect password or email'
      }
    } catch {
      // Modifie le message d'erreur si une erreur interne se produit
      errorMessage.value = 'Internal error, please try again later'
    }
  }

  /**
   * Déconnecte l'utilisateur actuellement connecté.
   *
   * @returns {Promise<void>} - Promesse qui se résout une fois la déconnexion terminée ou échouée.
   */
  const logout = async (): Promise<void> => {
    try {
      // Déconnecte l'utilisateur via Firebase Authentication
      await signOut(auth)

      // Réinitialise l'état utilisateur et les données associées
      user.value = null
      userData.value = null
    } catch {
      // Modifie le message d'erreur pour indiquer une erreur interne
      errorMessage.value = 'Internal error, please try again later'
    }
  }

  // Retourne les données utilisateur et les fonctions pour l'utilisation dans les composants Vue
  return { user, userData, errorMessage, login, logout }
})
