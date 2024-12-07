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

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="form-group">
        <button type="submit" class="submit-button">Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

// CSS
import '../assets/styles/authForm.css'

export default {
  name: 'AuthForm',
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')

    const handleLogin = async () => {
      errorMessage.value = ''
      await authStore.login(email.value, password.value)
      if (authStore.errorMessage) {
        errorMessage.value = authStore.errorMessage
      }
    }

    return { email, password, handleLogin, errorMessage }
  },
}
</script>
