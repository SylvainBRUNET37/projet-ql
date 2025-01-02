<template>
     <div class="form-container">
      <h1>Equipment Details</h1>
      <form @submit.prevent="saveChanges" class="equipment-form">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="equipment.name" />
        </div>
        <div class="form-group">
          <label>Reference:</label>
          <input v-model="equipment.ref" />
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input v-model="equipment.type" />
        </div>
        <div class="form-group">
          <label>Status:</label>
          <input v-model="equipment.status" />
        </div>
        <div class="form-actions">
          <button type="button" class="button cancel" @click="goBack">Back</button>
        </div>
      </form>
    </div>
</template>

<script>


import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
  
  export default {
    data() {
      return {
        equipment: null,
      };
    },
    async created() {
      const equipmentId = this.$route.params.id;
      const docRef = doc(db, 'equipments', equipmentId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        this.equipment = { id: docSnap.id, ...docSnap.data() };
      } else {
        alert('Equipment not found!');
        this.goBack();
      }
    },
    methods: {
        goBack() {
        this.$router.push('/home');
      },
    }
}
</script>
