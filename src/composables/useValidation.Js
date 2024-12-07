import { ref } from 'vue'

export function useValidation() {
  const isValidEmail = ref(false)
  const isValidPassword = ref(false)

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    isValidEmail.value = regex.test(email)
    return isValidEmail.value
  }

  const validatePassword = (password) => {
    isValidPassword.value = password.length >= 6
    return isValidPassword.value
  }

  return { isValidEmail, isValidPassword, validateEmail, validatePassword }
}
