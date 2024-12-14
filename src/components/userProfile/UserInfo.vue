<template>
  <div class="content">
    <p class="mb-4">Need to change something? Ask an administrator!</p>
    <p><strong>Last name:</strong> {{ userInfo?.lastName || 'Not available' }}</p>
    <p><strong>First name:</strong> {{ userInfo?.firstName || 'Not available' }}</p>
    <p><strong>Mail:</strong> {{ userInfo?.email || 'Not available' }}</p>
    <p><strong>Role:</strong> {{ userInfo?.role || 'Not available' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'UserInfo',
  props: {
    userInfo: {
      type: Object as PropType<{
        lastName: string
        firstName: string
        email: string
        role: string
      } | null>,
      required: true,
      default: () => null,
    },
  },
})
</script>
