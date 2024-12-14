import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc, type DocumentData } from 'firebase/firestore'

export const AuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const userData: Ref<DocumentData | null> = ref(null)
  const errorMessage: Ref<string> = ref('')

  // User Login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Sign in via Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Get the user's UID
      const uid = userCredential.user.uid

      // Fetch additional user information from Firestore
      const userDocRef = doc(db, 'users', uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        userData.value = userDocSnap.data()
      } else {
        errorMessage.value = 'User data not found in Firestore'
      }

      errorMessage.value = ''
    } catch {
      errorMessage.value = 'Invalid password or email'
    }
  }

  // User Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      user.value = null
      userData.value = null
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        errorMessage.value = `Logout error: ${error.message}`
      } else {
        errorMessage.value = 'Logout error: An unknown error occurred'
      }
    }
  }

  return { user, userData, errorMessage, login, logout }
})
