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

      <!-- Error message -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- Success message -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="form-group">
        <button type="submit" class="submit-button">Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { AuthStore } from '../stores/auth'

export default {
  name: 'AuthForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')

    const authStore = AuthStore()

    const handleLogin = async () => {
      errorMessage.value = ''
      successMessage.value = ''

      // Make sure authStore is being properly used
      await authStore.login(email.value, password.value)

      if (authStore.errorMessage) {
        errorMessage.value = authStore.errorMessage
      } else {
        successMessage.value = 'Login successful! Welcome back.'
      }
    }

    return { email, password, handleLogin, errorMessage, successMessage }
  },
}
</script>
