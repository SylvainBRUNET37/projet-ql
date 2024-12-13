<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
//import './assets/styles/app.css' // Importation du fichier CSS

export default {
  name: 'App',
}
</script>

<style>
/* Styles simples pour la navigation */
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f4f4f4;
}

nav ul li {
  display: inline;
}

nav ul li a {
  text-decoration: none;
  color: #007bff;
}

nav ul li a.router-link-active {
  font-weight: bold;
  color: #0056b3;
}
</style>