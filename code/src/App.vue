<!-- src/App.vue -->
<template>
  <div id="app">
    <FirestoreExample />
    <AuthExample />
  </div>
</template>

<script>
import FirestoreExample from './components/FirestoreExample.vue';
import AuthExample from './components/AuthExample.vue';

export default {
  name: 'App',
  components: {
    FirestoreExample,
    AuthExample,
  },
};
</script>

<style>
/* Ajoute des styles personnalisés ici si nécessaire */
</style>