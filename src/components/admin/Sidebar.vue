<template>
    <div class="sidebar">
      <h3>Administration</h3>
      <ul>
        <li>
        <router-link to="/admin">🏠 Home page</router-link>
      </li>
      <li>
        <router-link to="/admin">💻 Equipment Management</router-link>
      </li>
      <li>
        <router-link to="/admin">👥 User Management</router-link>
      </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminSidebar', // Utilise un nom multi-mots
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
    height: 100vh;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  .sidebar h3 {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar a {
    text-decoration: none;
    color: #333;
    display: flex;
    align-items: center;
  }
  .sidebar a:hover {
    color: #007Bff;
  }
  </style>
  