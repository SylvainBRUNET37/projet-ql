import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const errorMessage = ref('')

  // Observer l'état de l'utilisateur connecté
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })

  // Connexion de l'utilisateur
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      errorMessage.value = ''
    } catch (error) {
      errorMessage.value = `Erreur: ${error.message}`
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
