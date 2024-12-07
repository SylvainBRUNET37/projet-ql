<!-- src/App.vue -->
<template>
  <div id="app">
    <FirestoreExample />
    <AuthExample />
  </div>
</template>

<script>
import AuthExample from './components/Login.vue'

export default {
  name: 'App',
  components: {
    AuthExample,
  },
}
</script>

<style>
/* Global CSS */
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  display: flex;
  justify-content: center; /* Centrage horizontal */
  align-items: center; /* Centrage vertical */
  min-height: 100vh; /* Occupe toute la hauteur de la fenêtre */
}
</style>
