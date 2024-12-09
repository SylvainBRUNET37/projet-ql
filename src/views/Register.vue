<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue'

// CSS
import '../assets/styles/authForm.css'

export default {
  name: 'Register',
  components: {
    RegisterForm,
  },
}
</script>
