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
        <input class="input" type="text" placeholder="Search for equipment to borrow..." v-model="search" v-on:keyup.enter="searchEquipments"/>
        <button class="button" @click="searchEquipments">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <!-- Liste des équipements -->
      <div class="fixed-grid has-auto-count">
        <div class="grid">
        <div class="equipment-content" v-for="equipment in equipmentToDisplay" :key="equipment.id">
        <div class="card" @click="handleContent(), handleId(equipment.id)">
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
  emits: ["switchContent", "setId"],
  setup(){
   
    const equipmentStore = EquipmentStore();
    const allEquipments = computed(() => {
      return equipmentStore.equipment;
    })

    onMounted(() => {
      equipmentStore.getAllEquipment();
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

  
  methods: {
    handleContent(){
        this.$emit('switchContent', "EquipmentDetailsOnly");
    },

    handleId(id: string){
    if(id !== null){
        console.log(" id:", id);
        this.$emit('setId', id);
      }
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
  height: 100%;
}

.filter-container {
  background-color: #ebebeb;
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
  gap: 8px;
  margin-bottom: 20px;
  width: 50%;
  justify-content: center;
  margin-left: 14px;
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
  background-color: #d3d3d3;
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
  min-height: 288px; 
  min-width: 204px;
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
  justify-content: center;
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
