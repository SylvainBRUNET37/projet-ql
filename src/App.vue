<!-- src/App.vue -->
<template>
    <div id="app">
      <FirestoreExample />
      <AuthExample />
    </div>
  </template>

	
<script>

import AuthExample from './components/AuthExample.vue';

export default {
name: 'App',
components: {

	AuthExample,
},
};
</script>

 