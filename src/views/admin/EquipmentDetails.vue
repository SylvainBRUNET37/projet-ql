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
        <input v-model="equipment.ref" readonly />
      </div>
      <div class="form-group">
        <label>Type:</label>
        <input v-model="equipment.type" />
      </div>
      <div class="form-group">
        <label>Status:</label>
        <select v-model="equipment.status">
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="button save">Save</button>
        <button type="button" class="button cancel" @click="goBack">Back</button>
      </div>
    </form>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
    async saveChanges() {
      try {
        const docRef = doc(db, 'equipments', this.equipment.id);
        // Éviter d'envoyer une référence modifiée à Firestore
        const { ref, ...updatedFields } = this.equipment;
        await updateDoc(docRef, updatedFields);
        alert('Changes saved successfully!');
        this.goBack();
      } catch (error) {
        console.error('Error while saving changes:', error);
        alert('Unable to save changes.');
      }
    },
    goBack() {
      this.$router.push('/home');
      this.$emit('switchContent','EquipmentManagement');
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-group input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button.save {
  background-color: #007bff;
  color: white;
}

.button.save:hover {
  background-color: #0056b3;
}

.button.cancel {
  background-color: #f44336;
  color: white;
}

.button.cancel:hover {
  background-color: #d32f2f;
}
</style>
