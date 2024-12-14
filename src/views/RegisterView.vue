<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script lang="ts">
import RegisterForm from '../components/RegisterForm.vue'

// CSS
import '../assets/styles/authForm.css'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm,
  },
}
</script>
