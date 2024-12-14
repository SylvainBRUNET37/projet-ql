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
  name: 'Auth',
  components: {
    AuthForm,
  },
}
</script>
