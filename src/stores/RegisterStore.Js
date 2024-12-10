import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const RegisterStore = defineStore('register', () => {
  const user = ref(null)
  const userData = ref(null)
  const errorMessage = ref('')

  // Enregistrement de l'utilisateur
  const register = async (lastName, firstName, role, email, password) => {
    try {
      // Vérifier si l'email est déjà utilisé
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)

      if (signInMethods.length > 0) {
        // L'email est déjà utilisé, retourner une erreur
        errorMessage.value = 'Email is already in use.'
        return
      }

      // Créer un utilisateur via Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Récupérer l'UID de l'utilisateur
      const uid = userCredential.user.uid

      // Ajouter des informations supplémentaires dans Firestore
      const userDocRef = doc(db, 'users', uid)
      await setDoc(userDocRef, {
        lastName,
        firstName,
        role,
        email,
        createdAt: new Date().toISOString(),
        status: 'active',
      })

      // Mettre à jour les données locales
      userData.value = { lastName, firstName, role, email }
      errorMessage.value = '' // Clear any previous errors
    } catch (error) {
      errorMessage.value = error.message || 'Registration failed'
    }
  }

  return { user, userData, errorMessage, register }
})
