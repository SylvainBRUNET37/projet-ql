<!-- EquipmentResearchView.vue -->

<template>
  <div>
    <Research />
  </div>
</template>

<script lang="ts">
import Research from '../components/equipmentResearch/Research.vue'

import '../assets/styles/form.css' // Import du CSS

export default {
  name: 'EquipmentResearchView',
  components: {
    Research,
  },
}
</script>
