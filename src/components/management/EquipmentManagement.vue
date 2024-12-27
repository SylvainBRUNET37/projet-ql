<template>
  <div>
    <table class="table is-hoverable">
      <thead>
        <tr>
          <th>Reference</th>
          <th>Status</th>
          <th>Type</th>
          <th>Description</th>
          <th>Details</th>
          <th>Disable</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipment in paginatedEquipments" :key="equipment.id">
          <td>{{ equipment.ref }}</td>
          <td>{{ equipment.status }}</td>
          <td>{{ equipment.type }}</td>
          <td>{{ equipment.description }}</td>
          <td>
            <button class="button is-link"  @click="$router.push(`/admin/equipment/${equipment.id}`)">Details</button>
          </td>
          <td>
            <button class="button is-link" @click="handleDisable(equipment.id)">Disable</button>
          </td>
          <td>
            <button class="button is-link" @click="handleDelete(equipment.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a
        :class="{ 'pagination-previous': true, 'is-disabled': isFirstPage }"
        @click="goToPreviousPage"
      >
        Previous
      </a>
      <a :class="{ 'pagination-next': true, 'is-disabled': isLastPage }" @click="goToNextPage">
        Next page
      </a>
      <ul class="pagination-list">
        <li>
          <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">
            Page {{ currentPage }} of {{ totalPages }}
          </a>
        </li>
      </ul>
    </nav>
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
    const currentPage = ref(1)
    const itemsPerPage = ref(15)
    const router = useRouter()

    const paginatedEquipments = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      return equipmentStore.equipment.slice(start, start + itemsPerPage.value)
    })

    const totalPages = computed(() =>
      Math.ceil(equipmentStore.equipment.length / itemsPerPage.value),
    )

    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    const handleDetails = (id: string) => {
      console.log('Details:', id)
    }

    const handleDisable = async (id: string) => {
      try {
        await equipmentStore.disableEquipment(id)
      } catch (error) {
        console.error('Error disabling equipment:', error)
      }
    }

    const handleDelete = async (id: string) => {
      try {
        await equipmentStore.deleteEquipment(id)
      } catch (error) {
        console.error('Error deleting equipment:', error)
      }
    }

    const handleAdd = () => {
      router.push('/add-material')
    }

    const goToPreviousPage = () => {
      if (!isFirstPage.value) currentPage.value--
    }

    const goToNextPage = () => {
      if (!isLastPage.value) currentPage.value++
    }

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
      handleDetails,
      handleDisable,
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
