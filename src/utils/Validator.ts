export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,20}$/
  return passwordRegex.test(password)
}
