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
/* Style général de l'application */
#app {
  font-family: 'Arial', sans-serif; /* Police de caractère simple et lisible */
  color: #333; /* Couleur de texte principale */
  background-color: #f4f4f9; /* Fond légèrement gris pour l'application */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Pour occuper toute la hauteur de la fenêtre */
}

/* Container général de l'application */
#app > * {
  width: 100%;
  max-width: 1200px; /* Limite de largeur pour éviter un trop grand étirement sur grands écrans */
  padding: 20px;
  box-sizing: border-box;
}

/* Assure un bon espacement et un alignement propre du contenu dans le composant */
router-view {
  display: block;
  text-align: center; /* Centrer tout le contenu à l'intérieur du router-view */
  width: 100%;
}
</style>
