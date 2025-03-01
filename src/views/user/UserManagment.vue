<!--
Ce composant permet d'afficher un tableau avec tous les utilisateurs. Via cette page, on peut supprimer un utilisateur ou le désactiver.
On peut aussi passer à la page de détails d'un utilisateur, ou à la page de création d'utilisateur.
-->
<template>
  <div>
    <h1>Users Management</h1>

    <!-- Tableau des utilisateurs -->
    <table class="table is-hoverable">
      <!-- En-tête du tableau -->
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Email</th>
          <th>Details</th>
          <th>Disable</th>
          <th>Delete</th>
        </tr>
      </thead>

      <!-- Ligne pour chaque utilisateur -->
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <!-- Affiche les informations de l'utilisateur -->
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.email }}</td>

          <!-- Bouton pour afficher les détails de l'utilisateur -->
          <td>
            <button class="button is-link" @click="handleDetails(user.id)">Details</button>
          </td>

          <!-- Bouton pour changer le status de l'utilisateur -->
          <td>
            <button class="button is-link" @click="handleToggleStatus(user.id, user.status)">
              {{ user.status === 'active' ? 'Disable' : 'Enable' }}
            </button>
          </td>

          <!-- Bouton pour supprimer l'utilisateur -->
          <td>
            <button class="button is-link" @click="handleDelete(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav class="pagination" role="navigation" aria-label="pagination">
      <!-- Bouton pour passer à la page précédente -->
      <a
        :class="{ 'pagination-previous': true, 'is-disabled': isFirstPage }"
        @click="goToPreviousPage"
      >
        Previous
      </a>

      <!-- Bouton pour passer à la page suivante -->
      <a :class="{ 'pagination-next': true, 'is-disabled': isLastPage }" @click="goToNextPage">
        Next page
      </a>

      <!-- Affiche la page courante -->
      <ul class="pagination-list">
        <li>
          <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">
            Page {{ currentPage }} of {{ totalPages }}
          </a>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Bouton d'ajout d'utilisateur -->
  <div class="add-button-container">
    <button class="button is-primary" @click="handleAdd">Add</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { UserStore } from '../../stores/UserStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const userStore = UserStore()
    const currentPage = ref(1) // Page courante
    const itemsPerPage = ref(10) // Nombre d'utilisateur max par page
    const router = useRouter()

    // Calcul du nombre total de pages et si on est sur la première ou la dernière page
    const totalPages = computed(() => Math.ceil(userStore.users.length / itemsPerPage.value))
    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    // Récupère et stocke les utilisateurs paginés
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      return userStore.users.slice(start, start + itemsPerPage.value)
    })

    /**
     * Supprime un utilisateur après confirmation.
     *
     * @param {string} userId - L'ID de l'utilisateur à supprimer.
     */
    const handleDelete = async (userId: string) => {
      // Demande de confirmation avant suppression
      const confirmed = window.confirm('Do you really want to delete this user ?')

      // Si l'utilisateur annule, on ne supprime pas l'utilisateur
      if (!confirmed) {
        return
      }

      // Sinon, suppression de l'utilisateur
      try {
        await userStore.deleteUserById(userId)
        userStore.getUsers()
      } catch (error) {
        console.error('Error deleting user: ', error)
      }
    }

    /**
     * Redirige vers la page d'ajout d'un nouvel utilisateur.
     */
    const handleAdd = () => {
      router.push('/register')
    }

    /**
     * Change le statut d'un utilisateur.
     *
     * @param {string} userId - L'ID de l'utilisateur.
     * @param {string} status - Le statut actuel de l'utilisateur.
     */
    const handleToggleStatus = async (userId: string, status: string) => {
      // Change le statut de l'utilisateur et met à jour la liste des utilisateurs
      await userStore.updateUserStatus(userId, status)
      await userStore.getUsers()
    }

    /**
     * Redirige vers la page des détails d'un utilisateur.
     *
     * @param {string} userId - L'ID de l'utilisateur à afficher.
     */
    const handleDetails = (userId: string) => {
      router.push(`/admin/user/${userId}`)
      console.log(userId)
    }

    /**
     * Va à la page précédente si ce n'est pas déjà la première page.
     */
    const goToPreviousPage = () => {
      if (!isFirstPage.value) currentPage.value--
    }

    /**
     * Va à la page suivante si ce n'est pas déjà la dernière page.
     */
    const goToNextPage = () => {
      if (!isLastPage.value) currentPage.value++
    }

    // Récupère les utilisateurs au chargement du composant
    onMounted(async () => {
      await userStore.getUsers()
    })

    return {
      currentPage,
      itemsPerPage,
      paginatedUsers,
      totalPages,
      isFirstPage,
      isLastPage,
      handleToggleStatus,
      handleDetails,
      goToPreviousPage,
      goToNextPage,
      handleAdd,
      handleDelete,
    }
  },
})
</script>

<style scoped>
.table {
  --bulma-table-color: hsl(221deg, 14%, 10%);
  --bulma-table-background-color: hsl(221, 14%, 100%);
  --bulma-table-cell-border-color: hsl(0, 0%, 38%, 0.033);
  --bulma-table-row-hover-background-color: hsla(0, 0%, 38%, 0.033);
}

.add-button-container {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
