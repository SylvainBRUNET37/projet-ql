<template>
  <div class="content">
    <p class="mb-4">Need to change something? Ask an administrator!</p>
    <p><strong>Last name:</strong> {{ userInfo?.lastName || 'Not available' }}</p>
    <p><strong>First name:</strong> {{ userInfo?.firstName || 'Not available' }}</p>
    <p><strong>Mail:</strong> {{ userInfo?.email || 'Not available' }}</p>
    <p><strong>ID number:</strong> {{ userInfo?.id || 'Not available' }}</p>
    <p><strong>Role:</strong> {{ roleLabel }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { UserStore } from '@/stores/UserStore.ts'

export default defineComponent({
  name: 'PersonalInfoTab',
  setup() {
    const userInfoStore = UserStore()

    // Calculer le rôle de l'utilisateur
    const roleLabel = computed(() =>
      userInfoStore.userData?.role === 1 ? 'Borrower' : 'Administrator',
    )

    return {
      userInfo: userInfoStore.userData,
      roleLabel,
    }
  },
})
</script>
