<!-- AuthView.vue -->

<template>
  <div>
    <AuthForm />
  </div>
</template>

<script lang="ts">
import AuthForm from '../components/form/AuthForm.vue'

import '../assets/styles/form.css' // Import du CSS

export default {
  name: 'AuthView',
  components: {
    AuthForm,
  },
}
</script>
