<template>
  <div>
    <UserProfile />
  </div>
</template>

<script lang="ts">
import UserProfile from '../components/UserProfile.vue'

import '../assets/styles/userProfile.css' // Import du CSS

export default {
  name: 'UserProfileView',
  components: {
    UserProfile,
  },
}
</script>
