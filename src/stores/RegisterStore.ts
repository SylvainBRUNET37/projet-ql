import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  type User,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

interface UserData {
  lastName: string
  firstName: string
  role: string
  email: string
}

export const RegisterStore = defineStore('register', () => {
  const user: Ref<User | null> = ref(null)
  const userData: Ref<UserData | null> = ref(null)
  const errorMessage: Ref<string> = ref('')

  const register = async (
    lastName: string,
    firstName: string,
    role: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)

      if (signInMethods.length > 0) {
        errorMessage.value = 'Email is already in use.'
        return
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      const uid = userCredential.user.uid

      const userDocRef = doc(db, 'users', uid)
      await setDoc(userDocRef, {
        lastName,
        firstName,
        role,
        email,
        createdAt: new Date().toISOString(),
        status: 'active',
      })

      userData.value = { lastName, firstName, role, email }
      errorMessage.value = ''
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message || 'Registration failed'
      } else {
        errorMessage.value = 'Registration failed'
      }
    }
  }

  return { user, userData, errorMessage, register }
})
