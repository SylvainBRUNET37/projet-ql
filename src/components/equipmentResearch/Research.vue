<template>
  <div class="SecondLayout">
   
    <div class="filter-container">
      <div class="content">
        <h3>Filters</h3>
        <button class="button" @click="resetFilters">Reset</button>
      </div>
      <div class="tags">
        <div class="container" v-for="type in allTypes" :key="type">
          <span class="tag is-info is-light is-hoverable" @click="filterEquipements(type)">{{ type }} </span>
        </div>
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
        <div class="equipment-content" v-for="equipment in equipmentToDisplay" :key="equipment.id">
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
import func from 'vue-editor-bridge';

export default {
  name: 'EquipmentResearch',
  setup(){
    const equipmentStore = EquipmentStore();
    const allEquipments = computed(() => {
      return equipmentStore.equipment;
    })

    onMounted(() => {
      equipmentStore.getAllEquipment()
    })

    const allTypes = computed(() => {
      //récuperer tous les types différents  
      //tableau de string
      const types: string[] = [];
      allEquipments.value.forEach(equipment => {
        if(equipment.type && !(types.includes(equipment.type))){
          types.push(equipment.type);
        }
      });
      return types;
    })

    const search = ref('');
    const filteredEquipments = ref(allEquipments.value);

    function searchEquipments(){
      if (search.value.trim() === '') {
        filteredEquipments.value = allEquipments.value;
        alert('no  match');
      } else {
        filteredEquipments.value = allEquipments.value.filter(equipment =>
        equipment.name.toLowerCase().includes(search.value.toLowerCase()));
        if(filteredEquipments.value.length === 0){
          alert('no  match');
        }
      }
    };

    /**
     * met à jour les éléments de filtered equipmens lors qu'on clique sur un tag
     * @param type le type qui est la valeur du tag
     */
    function filterEquipements(type: string){
      filteredEquipments.value = allEquipments.value.filter(equipment =>
      equipment.type.toLowerCase() === (type.toLowerCase()));
    }

    /**
     * remet à jour filteredEquipments avec allEquipments
     */
    function resetFilters(){
      filteredEquipments.value = allEquipments.value;
    }

    // si pas d'equipements cherchés on met tous les equipements à afficher
    //on boucle sur equipmentToDisplay qui dépende de filteredEquipments qui est mis à jour automatiquement 
    const equipmentToDisplay = computed(() => 
      filteredEquipments.value.length > 0 ? filteredEquipments.value : allEquipments.value
    );
    return {
      allEquipments,
      search,
      searchEquipments,
      filteredEquipments,
      equipmentToDisplay,
      allTypes,
      filterEquipements,
      resetFilters,
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
  background-color: #cccccc;
  color: white;
  text-align: left;
  padding: 5px;
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

.container{

}
</style>
