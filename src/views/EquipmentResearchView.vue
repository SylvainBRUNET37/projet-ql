<!-- EquipmentResearchView.vue -->

<template>
  <div>
    <EquipmentResearch />
  </div>
</template>

<script lang="ts">
import EquipmentResearch from '@/components/equipmentResearch/Research.vue'

import '../assets/styles/form.css' // Import du CSS

export default {
  name: 'EquipmentResearchView',
  components: {
    EquipmentResearch,
  },
}
</script>
