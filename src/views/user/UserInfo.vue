<!-- Ce composant est utilisé pour afficher les informations de compte d'un utilisateur -->

<template>
  <div class="container">
    <h1 class="title">Your Profile</h1>
    <div class="card">
      <div class="card-content">
        <!-- Puisque l'utilisateur ne peut pas changer lui même ses informations, affiche ce message pour lui indiquer -->
        <p class="info-message">
          <i class="icon-alert"></i>
          Need to change something? Ask an administrator!
        </p>

        <!-- Informations de l'utilisateur -->
        <ul class="user-info">
          <li>
            <span class="label">Last name:</span>
            <span class="value">{{ userInfo?.lastName || 'Not available' }}</span>
          </li>
          <li>
            <span class="label">First name:</span>
            <span class="value">{{ userInfo?.firstName || 'Not available' }}</span>
          </li>
          <li>
            <span class="label">Mail:</span>
            <span class="value">{{ userInfo?.email || 'Not available' }}</span>
          </li>
          <li>
            <span class="label">Role:</span>
            <span class="value">{{ userInfo?.role || 'Not available' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

/**
 * Composant affichant les informations de compte d'un utilisateur.
 *
 * @prop {Object} userInfo - Informations de l'utilisateur.
 */
export default defineComponent({
  name: 'UserInfo',
  props: {
    // Informations de l'utilisateur
    userInfo: {
      type: Object as PropType<{
        id: string
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
/* Global container */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Title */
.title {
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 1.5rem;
}

/* Card */
.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-message {
  font-size: 1rem;
  color: #495057;
  background: #e9ecef;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-message .icon-alert {
  font-size: 1.2rem;
  color: #ffc107;
}

.user-info {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.user-info li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.user-info li:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #343a40;
}

.value {
  color: #6c757d;
}
</style>
