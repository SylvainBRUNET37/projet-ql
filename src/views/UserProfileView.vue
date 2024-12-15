<!-- UserProfileView.vue -->

<template>
  <div>
    <UserProfile />
  </div>
</template>

<script lang="ts">
import UserProfile from '../components/userProfile/UserProfile.vue'

export default {
  name: 'UserProfileView',
  components: {
    UserProfile,
  },
}
</script>
