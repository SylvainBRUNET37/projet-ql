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
      <tr v-for="(equipment, index) in allEquipments" :key="equipment.ref">
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
  <a class="pagination-previous is-disabled" title="This is the first page"
    >Previous</a
  >
  <a href="#" class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li>
      <a
        class="pagination-link is-current"
        aria-label="Page 1"
        aria-current="page"
        >1</a
      >
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
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'EquipmentManagment',

  data(){
    return{  
      allEquipments: [
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
        { ref: 'EQ123', description: 'Laptop', status: 'Active'  },
        { ref: 'EQ124', description: 'Printer', status: 'Inactive' },
      ]
    };  
  },
  created(){
    this.setEquipment();
  },
  methods: {
    //récupère le nv equipement et le push dans la liste allEquipments
    addEquipement(){},
    //supprime un equipement dans la bdd
    delEquipement(){},
    ////récupère le nv equipement et le push dans la liste allEquipments
    editEquipement(){},
    //renvoie vers la vue de visualisation
    viewEquipement(){},
    //récupère tous les équipements de la bdd
    getEquipments(){},
    //met à jour le tableau dans data pour afficher dynamiquement
    setEquipment(){},
    //change la pagination
    switchPagination(id: number){},
 },

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