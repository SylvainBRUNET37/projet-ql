<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0; /* Retirer les marges par défaut */
}

.app-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>