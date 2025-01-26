<template>
  <section class="hero is-succes is-fullheight">
    <div id="app">
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<style scoped>
html, body {
  margin: 0; 
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; 
  height: 100vh;
 
}
#app{
  height: inherit;
  width: inherit;
  background-color: #ffffff; 
}

.app-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #ffffff; 
}

*,*::before,*::after{
margin: 0;
padding:0;
}
</style>