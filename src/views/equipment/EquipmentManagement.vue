<!--
Ce composant permet d'afficher un tableau avec tous les équipements. Via cette page, on peut supprimer un équipement ou le désactiver.
On peut aussi passer à la page de détails d'un équipement, ou à la page de création d'équipement.
-->

<template>
  <div>
    <h1>Equipment Management</h1>

    <!-- Tableau des équipements -->
    <table class="table is-hoverable">
      <!-- En-tête du tableau -->
      <thead>
        <tr>
          <th>Reference</th>
          <th>Name</th>
          <th>Status</th>
          <th>Type</th>
          <th>Description</th>
          <th>Details</th>
          <th>Disable</th>
          <th>Delete</th>
        </tr>
      </thead>

      <!-- Ligne pour chaque équipement -->
      <tbody>
        <tr v-for="equipment in paginatedEquipments" :key="equipment.id">
          <!-- Affiche les informations de l'équipement -->
          <td>{{ equipment.ref }}</td>
          <td>{{ equipment.name }}</td>
          <td>{{ equipment.status }}</td>
          <td>{{ equipment.type }}</td>
          <td>{{ equipment.description }}</td>

          <!-- Bouton pour afficher les détails de l'équipement -->
          <td>
            <button class="button is-link" @click="$router.push(`admin/equipment/${equipment.id}`)">
              Details
            </button>
          </td>

          <!-- Bouton pour changer le status de l'équipement -->
          <td>
            <button
              class="button is-link"
              @click="handleToggleStatus(equipment.id, equipment.status)"
            >
              {{ equipment.status === 'available' ? 'Disable' : 'Enable' }}
            </button>
          </td>

          <!-- Bouton pour supprimer l'équipement -->
          <td>
            <button class="button is-link" @click="handleDelete(equipment.id)">Delete</button>
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

      <!-- Affichage de la page courante -->
      <ul class="pagination-list">
        <li>
          <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">
            Page {{ currentPage }} of {{ totalPages }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- Bouton pour ajouter un équipement -->
    <div class="add-button-container">
      <button class="button is-primary" @click="handleAdd">Add</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'EquipmentManagement',

  setup() {
    const equipmentStore = EquipmentStore()
    const currentPage = ref(1) // Page courante
    const itemsPerPage = ref(10) // Nombre d'équipements max par page
    const router = useRouter()

    // Calcul du nombre total de pages et si on est sur la première ou la dernière page
    const totalPages = computed(() =>
      Math.ceil(equipmentStore.equipment.length / itemsPerPage.value),
    )
    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    // Récupère et stocke les équipements paginés
    const paginatedEquipments = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      return equipmentStore.equipment.slice(start, start + itemsPerPage.value)
    })

    /**
     * Active ou désactive un équipement en fonction de son statut actuel.
     *
     * @param {string} equipmentId - L'ID de l'équipement à modifier.
     * @param {string} currentStatus - Le statut actuel de l'équipement (ex: 'available', 'disabled').
     */
    const handleToggleStatus = async (equipmentId: string, currentStatus: string) => {
      try {
        // Inverse le status de l'équipement et met à jour la liste des équipements
        await equipmentStore.updateEquipmentStatus(equipmentId, currentStatus)
        await equipmentStore.getAllEquipment()
      } catch (error) {
        console.error('Error toggling equipment status:', error)
      }
    }

    /**
     * Supprime un équipement après confirmation.
     *
     * @param {string} id - L'ID de l'équipement à supprimer.
     */
    const handleDelete = async (id: string) => {
      // Demande de confirmation avant suppression
      const confirmed = window.confirm('Do you really want to delete this equipment ?')

      // Si l'utilisateur annule, on ne supprime pas l'équipement
      if (!confirmed) {
        return
      }

      // Sinon, suppression de l'équipement
      try {
        await equipmentStore.deleteEquipment(id)
        equipmentStore.getAllEquipment()
      } catch (error) {
        console.error('Error deleting equipment:', error)
      }
    }

    /**
     * Redirige vers la page d'ajout d'un nouvel équipement.
     */
    const handleAdd = () => {
      router.push('/add-equipment')
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

    // Récupère tous les équipements au montage du composant
    onMounted(() => {
      equipmentStore.getAllEquipment()
    })

    return {
      currentPage,
      itemsPerPage,
      paginatedEquipments,
      totalPages,
      isFirstPage,
      isLastPage,
      handleToggleStatus,
      handleDelete,
      handleAdd,
      goToPreviousPage,
      goToNextPage,
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
