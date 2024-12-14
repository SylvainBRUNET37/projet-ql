<template>
  <div>
    <AuthForm />
  </div>
</template>

<script lang="ts">
import AuthForm from '../components/AuthForm.vue'

import '../assets/styles/form.css' // Import du CSS

export default {
  name: 'AuthView',
  components: {
    AuthForm,
  },
}
</script>
