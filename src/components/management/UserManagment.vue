<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>Firstname</th>
        <th>Name</th>
        <th>Details</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in getUserByPage" :key="user.id">
        <td> {{ user.id }}</td>
        <td> {{ user.firstName }}</td>
        <td> {{ user.name }}</td>
        <!--@click="$emits('switchContent', 'testview')-->
        <td><button class="button is-link" style="background-color: hsl(223, 100%, 63%)">details</button></td>
        <td><button class="button is-link">delete</button></td>
      </tr>  
    </tbody>
  </table>
  <nav class="pagination" role="navigation" aria-label="pagination">
  <a v-bind:class="getClassPaginationPrevious()" @click="goToPreviousPage">Previous</a
  >
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
import { textSpanIntersectsWithPosition } from 'typescript';
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'UserManagment',

  data(){
    return{  
      currentPage : 1,
      nbUsersByPage: 15,
      numberPages: 0,
      allUsers: [
        { id: '1', firstName: 'james', name: 'doe' },
        { id: '2', firstName: 'james', name: 'doe' },
        { id: '3', firstName: 'james', name: 'doe' },
        { id: '4', firstName: 'james', name: 'doe' },
        { id: '5', firstName: 'james', name: 'doe' },
        { id: '6', firstName: 'james', name: 'doe' },
        { id: '7', firstName: 'james', name: 'doe' },
        { id: '8', firstName: 'james', name: 'doe' },
        { id: '9', firstName: 'james', name: 'doe' },
        { id: '10', firstName: 'james', name: 'doe' },
        { id: '11', firstName: 'james', name: 'doe' },
        { id: '12', firstName: 'james', name: 'doe' },
        { id: '13', firstName: 'james', name: 'doe' },
        { id: '14', firstName: 'james', name: 'doe' },
        { id: '15', firstName: 'james', name: 'doe' },
        { id: '16', firstName: 'james', name: 'doe' },
        { id: '17', firstName: 'james', name: 'doe' },
        { id: '18', firstName: 'james', name: 'doe' },
        { id: '19', firstName: 'james', name: 'doe' },
        { id: '20', firstName: 'james', name: 'doe' },
        { id: '21', firstName: 'james', name: 'doe' },
        { id: '22', firstName: 'james', name: 'doe' },
        { id: '23', firstName: 'james', name: 'doe' },
        { id: '24', firstName: 'james', name: 'doe' },
        { id: '25', firstName: 'james', name: 'doe' },
        { id: '26', firstName: 'james', name: 'doe' },
        { id: '27', firstName: 'james', name: 'doe' },

      ]
    };  
  },
  created(){
    this.getUsers();
    this.getNumberPages();
  },
  methods: {
    //supprime un equipement dans la bdd
    delUser(id: number){},
    //renvoie vers la vue de visualisation
    viewUser(){},
    //récupère tous les équipements de la bdd et les met dans le tableau equipments
    getUsers(){},
    //change la pagination
    switchPagination(id: number){},
    
    //pour désactiver le boutton previous ou non
    getClassPaginationPrevious(){
      return{
        'pagination-previous is-disabled': this.currentPage === 1,
        'pagination-previous': !(this.currentPage === 1),
      }
    },
        
    isNextPageDisable(){
      if(this.currentPage === this.numberPages) return true;
      else return false;
    },

    isPreviousPageDisable(){
      if(this.currentPage === 1)  return true;
      else  return false;
    },
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
        this.getNumberPages();
      }
    }, 
    goToNexrPage(){
      if((this.currentPage < this.numberPages)){
        this.currentPage ++;
        this.getNumberPages();
      }
    },
    getNumberPages(){
      this.numberPages = Math.floor(this.allUsers.length /this.nbUsersByPage) +1;
      console.log(this.numberPages);
    },
 },
 computed: {
  getUserByPage(){
    //position du premier user à la current page
    const first = (this.currentPage -1) * this.nbUsersByPage;
    const end = first + this.nbUsersByPage;
    return this.allUsers.slice(first, end);
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