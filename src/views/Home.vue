<template>
  <div>
    <h1>Welcome to LocaMat</h1>
    <p v-if="user">Logged in as: {{ user.email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const logout = async () => {
      await authStore.logout()
    }

    return { user: authStore.user, logout }
  },
}
</script>
