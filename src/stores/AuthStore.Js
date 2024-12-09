import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase' // Assurez-vous que `db` est configuré pour Firestore
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const AuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userData = ref(null) // Pour stocker les données supplémentaires de Firestore
  const errorMessage = ref('')

  // Connexion de l'utilisateur
  const login = async (email, password) => {
    try {
      // Connexion via Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Récupérer l'UID de l'utilisateur
      const uid = userCredential.user.uid

      // Récupérer les informations supplémentaires dans Firestore
      const userDocRef = doc(db, 'users', uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        userData.value = userDocSnap.data()
      } else {
        errorMessage.value = 'User data not found in Firestore'
      }

      errorMessage.value = '' // Clear any previous errors
    } catch (error) {
      errorMessage.value = 'Invalid password or email'
    }
  }

  // Déconnexion de l'utilisateur
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      userData.value = null
    } catch (error) {
      errorMessage.value = `Erreur de déconnexion: ${error.message}`
    }
  }

  return { user, userData, errorMessage, login, logout }
})
