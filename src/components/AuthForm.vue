<template>
  <div class="auth-form">
    <h1 class="auth-form-title">Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="Enter your email"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Enter your password"
          class="form-input"
        />
      </div>

      <!-- Error message for form validation -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- Success message -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="form-group">
        <button type="submit" class="submit-button" :disabled="!isFormValid">Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthStore } from '../stores/AuthStore.Js'
import { validateEmail, validatePassword } from '../utils/validator'

export default {
  name: 'AuthForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const userTriedSubmit = ref(false)
    const router = useRouter()

    const authStore = AuthStore()

    const handleLogin = async () => {
      errorMessage.value = ''
      successMessage.value = ''

      // Validate form before submitting
      if (!isFormValid.value) {
        errorMessage.value = 'Please enter a valid email and password.'
        userTriedSubmit.value = true
        return
      }

      // Proceed with the login process
      await authStore.login(email.value, password.value)

      if (authStore.errorMessage) {
        errorMessage.value = authStore.errorMessage
      } else {
        successMessage.value = 'Login successful! Welcome back.'
        router.push('/research')
      }
    }

    // Computed properties to check form validity
    const isEmailValid = computed(() => validateEmail(email.value))
    const isPasswordValid = computed(() => validatePassword(password.value))

    // Button should be disabled if email or password is invalid
    const isFormValid = computed(() => isEmailValid.value && isPasswordValid.value)

    return {
      email,
      password,
      handleLogin,
      errorMessage,
      successMessage,
      isFormValid,
      userTriedSubmit,
    }
  },
}
</script>
