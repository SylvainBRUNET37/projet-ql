<template>
  <div id="app">
    <!-- Barre de navigation simple -->
    <nav>
      <ul>
        <li><router-link to="/">Connexion</router-link></li>
        <li><router-link to="/firestore">Firestore Example</router-link></li>
        <li><router-link to="/HelloWorld">HelloWorld</router-link></li>
      </ul>
    </nav>

    <!-- Affichage dynamique basé sur la route -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
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


 