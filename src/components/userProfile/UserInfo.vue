<!-- UserInfo.vue -->

<template>
  <div class="content">
    <p class="mb-4">Need to change something? Ask an administrator!</p>

    <!-- Informations de l'utilisateur -->
    <p><strong>Last name:</strong> {{ userInfo?.lastName || 'Not available' }}</p>
    <p><strong>First name:</strong> {{ userInfo?.firstName || 'Not available' }}</p>
    <p><strong>Mail:</strong> {{ userInfo?.email || 'Not available' }}</p>
    <p><strong>Role:</strong> {{ userInfo?.role || 'Not available' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'UserInfo',
  props: {
    // Informations de l'utilisateur
    userInfo: {
      type: Object as PropType<{
        lastName: string
        firstName: string
        email: string
        role: string
      } | null>,
      required: true,
      default: () => null,
    },
  },
})
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.section {
  padding: 2rem;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3273dc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #275bb5;
}

h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #363636;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eaeaea;
}

.tabs ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}

.tabs li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px 4px 0 0;
  transition: background-color 0.3s ease;
}

.tabs li:hover {
  background-color: #f2f2f2;
}

.tabs li.is-active {
  background-color: white;
  border: 2px solid #eaeaea;
  border-bottom: none;
}

.tabs a {
  text-decoration: none;
  color: #363636;
  font-weight: bold;
}

/* Content */
.content {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  color: #4a4a4a;
}

.content strong {
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 1rem;
}

/* Cards */
.columns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.column {
  flex: 1;
  min-width: 220px;
  max-width: 25%;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image img {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 1rem;
  text-align: center;
}

.card-content .title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-content .subtitle {
  font-size: 0.875rem;
  color: #7a7a7a;
}

.card-content .has-text-success {
  color: #23d160;
}

.card-content .has-text-danger {
  color: #ff3860;
}
</style>
