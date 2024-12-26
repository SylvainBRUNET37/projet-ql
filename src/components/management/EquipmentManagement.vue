<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Reference</th>
        <th>Status</th>
        <th>Type</th>
        <th>Description</th>
        <th>Disable</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="equipment in equipmentStore.equipment" :key="equipment.id">
        <td>{{ equipment.ref }}</td>
        <td>{{ equipment.status }}</td>
        <td>{{ equipment.type }}</td>
        <td>{{ equipment.description }}</td>
        <td>
          <button class="button is-link" @click="disableEquipment(equipment.id)">Disable</button>
        </td>
        <td>
          <button class="button is-link" @click="deleteEquipment(equipment.id)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a :class="getClassPaginationPrevious" @click="goToPreviousPage"> Previous </a>
    <a href="#" :class="getClassPaginationNext" @click="goToNextPage"> Next page </a>
    <ul class="pagination-list">
      <li>
        <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">
          Page {{ currentPage }} of {{ numberPages }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { EquipmentStore } from '@/stores/EquipmentStore'

export default defineComponent({
  name: 'EquipmentManagement',

  setup() {
    const equipmentStore = EquipmentStore()

    const allEquipments = ref(equipmentStore.equipment)
    const currentPage = ref(1)
    const nbEquipmentsByPage = ref(15)
    const numberPages = ref(0)

    const getEquipments = async () => {
      await equipmentStore.getAllEquipment()
      calculateNumberPages()
    }

    const calculateNumberPages = () => {
      numberPages.value = Math.ceil(allEquipments.value.length / nbEquipmentsByPage.value)
    }

    const disableEquipment = async (equipmentId: string) => {
      await equipmentStore.disableEquipment(equipmentId)
      await getEquipments()
    }

    const deleteEquipment = async (equipmentId: string) => {
      await equipmentStore.deleteEquipment(equipmentId)
      await getEquipments()
    }

    const getEquipmentsByPage = computed(() => {
      const first = (currentPage.value - 1) * nbEquipmentsByPage.value
      const end = first + nbEquipmentsByPage.value
      return allEquipments.value.slice(first, end)
    })

    const getClassPaginationNext = computed(() => {
      return currentPage.value === numberPages.value
        ? 'pagination-next is-disabled'
        : 'pagination-next'
    })

    const getClassPaginationPrevious = computed(() => {
      return currentPage.value === 1 ? 'pagination-previous is-disabled' : 'pagination-previous'
    })

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const goToNextPage = () => {
      if (currentPage.value < numberPages.value) {
        currentPage.value++
      }
    }

    getEquipments()
    calculateNumberPages()

    return {
      currentPage,
      nbEquipmentsByPage,
      numberPages,
      allEquipments,
      equipmentStore,
      getEquipmentsByPage,
      disableEquipment,
      deleteEquipment,
      getClassPaginationNext,
      getClassPaginationPrevious,
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
</style>
