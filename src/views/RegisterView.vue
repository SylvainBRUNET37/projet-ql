<!-- RegisterView.vue -->

<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script lang="ts">
import RegisterForm from '../components/form/RegisterForm.vue'

//import '../assets/styles/form.css' // Import du CSS

export default {
  name: 'RegisterView',
  components: {
    RegisterForm,
  },
}
</script>
