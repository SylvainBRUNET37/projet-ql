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
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AuthForm',
  setup() {
    const authStore = useAuthStore()
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

<style scoped>
/* Style global pour l'authentification */
.auth-form {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.auth-form-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
