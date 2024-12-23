<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Ref</th>
        <th>status</th>
        <th>Desc</th>
        <th>Details</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(equipment, index) in getEquipmentsByPage" :key="equipment.ref">
        <td> {{ equipment.ref }}</td>
        <td> {{ equipment.status }}</td>
        <td> {{ equipment.description }}</td>
        <!--@click="$emits('switchContent', 'testview')-->
        <td><button class="button is-link" style="background-color: hsl(223, 100%, 63%)">details</button></td>
        <td><button class="button is-link">delete</button></td>
      </tr>  
    </tbody>
  </table>
  <nav class="pagination" role="navigation" aria-label="pagination">
  <a v-bind:class="getClassPaginationPrevious()" @click="goToPreviousPage">Previous</a>
  
  <a href="#" v-bind:class="getClassPaginationNext()" @click="goToNexrPage">Next page</a>
  <ul class="pagination-list">
    <li>
      <a
        class="pagination-link is-current"
        aria-label="Page 1"
        aria-current="page"
        >Page {{ currentPage }} of {{ numberPages }}</a
      >
    </li>
  </ul>
</nav>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'EquipmentManagment',

  data(){
    return{  
      currentPage : 1,
      nbEquipmentsByPage: 15,
      numberPages: 0,
      allEquipments: [
        { ref: 'EQ001', description: 'Monitor', status: 'Active' },
        { ref: 'EQ002', description: 'Keyboard', status: 'Inactive' },
        { ref: 'EQ003', description: 'Mouse', status: 'Active' },
        { ref: 'EQ004', description: 'Desk Chair', status: 'Inactive' },
        { ref: 'EQ005', description: 'Smartphone', status: 'Active' },
        { ref: 'EQ006', description: 'Tablet', status: 'Inactive' },
        { ref: 'EQ007', description: 'Projector', status: 'Active' },
        { ref: 'EQ008', description: 'Whiteboard', status: 'Inactive' },
        { ref: 'EQ009', description: 'Camera', status: 'Active' },
        { ref: 'EQ010', description: 'Tripod', status: 'Inactive' },
        { ref: 'EQ011', description: 'Microphone', status: 'Active' },
        { ref: 'EQ012', description: 'Speaker', status: 'Inactive' },
        { ref: 'EQ013', description: 'Hard Drive', status: 'Active' },
        { ref: 'EQ014', description: 'Router', status: 'Inactive' },
        { ref: 'EQ015', description: 'Switch', status: 'Active' },
        { ref: 'EQ016', description: 'Access Point', status: 'Inactive' },
        { ref: 'EQ017', description: 'Graphics Card', status: 'Active' },
        { ref: 'EQ018', description: 'Processor', status: 'Inactive' },
        { ref: 'EQ019', description: 'Motherboard', status: 'Active' },
        { ref: 'EQ020', description: 'RAM Module', status: 'Inactive' },
        { ref: 'EQ021', description: 'Power Supply', status: 'Active' },
        { ref: 'EQ022', description: 'UPS', status: 'Inactive' },
        { ref: 'EQ023', description: 'Cooling Fan', status: 'Active' },
        { ref: 'EQ024', description: 'VR Headset', status: 'Inactive' },
        { ref: 'EQ025', description: 'Gaming Console', status: 'Active' },
        { ref: 'EQ026', description: 'Joystick', status: 'Inactive' },
        { ref: 'EQ027', description: 'Headset', status: 'Active' },
        { ref: 'EQ028', description: 'Docking Station', status: 'Inactive' },
        { ref: 'EQ029', description: 'Network Cable', status: 'Active' },
        { ref: 'EQ030', description: 'Flash Drive', status: 'Inactive' },
        { ref: 'EQ031', description: 'External SSD', status: 'Active' },
        { ref: 'EQ032', description: 'Backup Server', status: 'Inactive' },
      ]
    };  
  },
  created(){
    this.getEquipments();
    this.getNumberPages();
  },
  methods: {
    //supprime un equipement dans la bdd
    delEquipement(){},
    //renvoie vers la vue de visualisation
    viewEquipement(){},
    //récupère tous les équipements de la bdd et les met dans le tableau equipments
    getEquipments(){},

    //pour désactiver le boutton next ou non
    getClassPaginationNext(){
      return{
        'pagination-next is-disabled': this.currentPage === this.numberPages,
        'pagination-next': !(this.currentPage === this.numberPages),
      }
    },
    goToPreviousPage(){
      if(this.currentPage > 1){
        this.currentPage--;
      }
    }, 
    goToNexrPage(){
      if((this.currentPage < this.numberPages)){
        this.currentPage ++;
      }
    },
    getNumberPages(){
      this.numberPages = Math.floor(this.allEquipments.length /this.nbEquipmentsByPage) +1;
      console.log(this.numberPages);
    },
    getClassPaginationPrevious(){
      return{
        'pagination-previous is-disabled': this.currentPage === 1,
        'pagination-previous': !(this.currentPage === 1),
      }
    },

 },
 computed: {
  getEquipmentsByPage(){
    //position du premier user à la current page
    const first = (this.currentPage -1) * this.nbEquipmentsByPage;
    const end = first + this.nbEquipmentsByPage;
    return this.allEquipments.slice(first, end);
  },
 }
})
</script>

<style scoped>
.table {
  --bulma-table-color: hsl(221deg,14%,10%);
  --bulma-table-background-color: hsl(221,14%,100%);
  --bulma-table-cell-border-color: hsl(0, 0%, 38%, 0.033);
  --bulma-table-row-hover-background-color: hsla(0, 0%, 38%, 0.033);
}



</style>