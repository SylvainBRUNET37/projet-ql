<template>
  <div>
    <AuthForm />
  </div>
</template>

<script lang="ts">
import AuthForm from '../components/AuthForm.vue'

// CSS
import '../assets/styles/authForm.css'

export default {
  name: 'AuthView',
  components: {
    AuthForm,
  },
}
</script>
