import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export const AuthStore = defineStore('auth', () => {
  const user = ref(null)
  const errorMessage = ref('')

  // Connexion de l'utilisateur
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
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
    } catch (error) {
      errorMessage.value = `Erreur de déconnexion: ${error.message}`
    }
  }

  return { user, errorMessage, login, logout }
})
