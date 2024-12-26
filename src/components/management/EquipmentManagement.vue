<template>
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
      <tr v-for="equipment in equipmentStore.equipment" :key="equipment.id">
        <td>{{ equipment.ref }}</td>
        <td>{{ equipment.type }}</td>
        <td>{{ equipment.status }}</td>
        <td>{{ equipment.description }}</td>
        <td>
          <button class="button is-link" style="background-color: hsl(223, 100%, 63%)">
            Details
          </button>
        </td>
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
    <a class="pagination-previous is-disabled" title="This is the first page">Previous</a>
    <a href="#" class="pagination-next">Next page</a>
    <ul class="pagination-list">
      <li>
        <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
      </li>
      <li>
        <a href="#" class="pagination-link" aria-label="Goto page 2">2</a>
      </li>
      <li>
        <a href="#" class="pagination-link" aria-label="Goto page 3">3</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { EquipmentStore } from '@/stores/EquipmentStore'

export default defineComponent({
  name: 'EquipmentManagment',

  setup() {
    const equipmentStore = EquipmentStore()

    // Charge les équipements
    equipmentStore.getAllEquipment()

    const disableEquipment = async (equipmentId: string) => {
      await equipmentStore.disableEquipment(equipmentId)
    }

    const deleteEquipment = async (equipmentId: string) => {
      await equipmentStore.deleteEquipment(equipmentId)
    }

    return { equipmentStore, deleteEquipment, disableEquipment }
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
