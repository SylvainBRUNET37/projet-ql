<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script lang="ts">
import UserForm from '../components/UserForm.vue'

// CSS
import '../assets/styles/authForm.css'

export default {
  name: 'RegisterView',
  components: {
    UserForm,
  },
}
</script>
