<template>
  <div class="SecondLayout">
    <!-- Colonne des filtres -->
    <div class="filter-container">
      <h3>Filtres</h3>
      <!-- Ajouter ici vos options de filtre -->
      <div class="column is-one-quarter">
          <aside class="menu">
            <p class="menu-label">Type of equipment</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox" value="Phone" />
                  Phone
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Computer" />
                  Computer
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Tablet" />
                  Tablet
                </label>
              </li>
            </ul>

            <p class="menu-label">Brand</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox"  value="Apple" />
                  Apple
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Samsung" />
                  Samsung
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Asus" />
                  Asus
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Other brand " />
                  Other brand
                </label>
              </li>
            </ul>

            <p class="menu-label">Status</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox"  value="Borrowed" />
                  Borrowed
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Not borrowed" />
                  Not borrowed
                </label>
              </li>
            </ul>
          </aside>
        </div>
      </div>

    <!-- Contenu principal -->
    <div class="content-container">
      <!-- Barre de recherche -->
      <div class="search-bar">
        <input class="search-input" type="text" placeholder="Search for equipment to borrow..." v-model="search" v-on:keyup.enter="searchEquipments"/>
        <button class="search-button" @click="searchEquipments" >
        </button>
      </div>
      <!-- Liste des équipements -->
      <div class="fixed-grid has-auto-count">
        <div class="grid">
        <div class="equipment-content" v-for="equipment in filteredEquipments" :key="equipment.id">
        <div class="card" @click="$router.push(`/equipment/${equipment.id}`)">
        <div class="card-image">
          
          <img :src="`/images/${equipment.image}`"/>
        </div>
        <div class="card-content">
          <p class="card-title">{{ equipment.name }}</p>
          <div class="card-footer">
            <p class="card-status" :class="{ borrowed: equipment.status === 'unavailable' }">
            {{ equipment.status }}
            </p>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EquipmentStore } from '@/stores/EquipmentStore';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'EquipmentResearch',
  setup(){
    const equipmentStore = EquipmentStore();
    const allEquipments = computed(() => {
      console.log(equipmentStore.equipment)
      return equipmentStore.equipment;
    })

    onMounted(() => {
      equipmentStore.getAllEquipment()
    })

    const search = ref('');
    console.log("SEARCH VALUE = ", search.value)
    const filteredEquipments = ref(allEquipments.value);
    console.log("SEARCH EQUIPMENTS = ", filteredEquipments)

    function searchEquipments(){
      if (search.value.trim() === '') {
        filteredEquipments.value = allEquipments.value;
        alert('no  matches');
      } else {
        filteredEquipments.value = allEquipments.value.filter(equipment =>
        equipment.name.toLowerCase().includes(search.value.toLowerCase()));
        if(filteredEquipments.value.length === 0){
          alert('no  matches');
        }
      }
    };
    return {
      allEquipments,
      search,
      searchEquipments,
      filteredEquipments,
    }
  },
};
</script>

<style scoped>
.SecondLayout {
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  height: 100vh;
}

.filter-container {
  background-color: blue;
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 50%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 30px 0 0 30px;
  outline: none;
}

.search-button {
  width: 40px;
  background-color: #8d8d8d;
  border: none;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  grid-auto-flow: row;
}

.column{
  display: flex;
}
.card {
  flex: 1 1 200px; 
  max-height: 288px; 
  max-width: 204px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 10px;
  margin: 15px;
  height: 100%;
  width: 100%;
}

.card-image img {
  width: 100px;
  height: auto;
}

.card-title {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
}

.card-footer{
  text-align: center;
}

.card-status {
  font-size: 0.9rem;
  color: green;
  text-align: center;
}

.card-status.borrowed {
  color: red;
  text-align: center;
}
</style>
