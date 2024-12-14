<template>
  <div class="columns">
    <div class="column" v-for="item in borrowedEquipment" :key="item.id">
      <div class="card">
        <div class="card-image">
          <figure>
            <img :src="item.image" :alt="item.name" />
          </figure>
        </div>
        <div class="card-content">
          <p class="title">{{ item.name }}</p>
          <p
            class="subtitle"
            :class="{
              'has-text-success': item.status === 'Not borrowed',
              'has-text-danger': item.status === 'Borrowed',
            }"
          >
            {{ item.status }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { UserStore } from '@/stores/UserStore'

export default defineComponent({
  name: 'EquipmentTab',
  setup() {
    const equipmentStore = EquipmentStore()
    const userInfoStore = UserStore()

    // Filtrer les équipements empruntés par l'utilisateur
    const borrowedEquipment = computed(() =>
      equipmentStore.getUserEquipments(userInfoStore.userData?.id || ''),
    )

    return {
      borrowedEquipment,
    }
  },
})
</script>
