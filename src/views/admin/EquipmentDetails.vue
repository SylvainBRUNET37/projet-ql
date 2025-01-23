<template>
  <div class="form-container">
    <h1>Equipment Details</h1>
    <div v-if="equipment">
      <form @submit.prevent="saveChanges" class="equipment-form">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="equipment.name" :readonly="!isAdmin" />
        </div>
        <div class="form-group">
          <label>Reference:</label>
          <input v-model="equipment.ref" :readonly="!isAdmin" />
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input v-model="equipment.type" :readonly="!isAdmin" />
        </div>
        <div class="form-group">
          <label>Status:</label>
          <select v-model="equipment.status" :disabled="!isAdmin">
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div v-if="!isAdmin" class="form-actions">
          <div class="form-group">
            <label>Start Date:</label>
            <input type="date" v-model="startDate" />
          </div>
          <div class="form-group">
            <label>End Date:</label>
            <input type="date" v-model="endDate" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="button cancel" @click="goBack">Back</button>
          <button
            type="button"
            class="button is-primary"
            @click="borrowEquipment"
            :disabled="equipment.status === 'unavailable'"
          >
            Borrow
          </button>
          <button type="submit" class="button save" :disabled="!isAdmin">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { BorrowStore } from '../../stores/BorrowStore';
import { UserStore } from '../../stores/UserStore';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const userStore = UserStore();
    const borrowStore = BorrowStore();
    const route = useRoute();
    const router = useRouter();
    const equipmentId = route.params.id.toString();

    const equipment = ref(null);
    const errorMessage = ref("");
    const startDate = ref<string | null>(null);
    const endDate = ref<string | null>(null);

    const borrowEquipment = async () => {
      const userId = userStore.getUserId();

      if (!userId) {
        alert("You must be logged in to borrow equipment.");
        return;
      }

      if (!equipment.value) {
        alert("Equipment details are not loaded yet. Please try again later.");
        return;
      }

      if (!startDate.value || !endDate.value) {
        alert("Please provide both start and end dates.");
        return;
      }

      const startDateMs = Date.parse(startDate.value);
      const endDateMs = Date.parse(endDate.value);
      console.log(startDateMs, "   ", endDateMs);
      try {
        await borrowStore.borrowEquipment(
          userId,
          equipmentId,
          startDateMs,
          endDateMs,
        );
        alert("Equipment borrowed successfully!");
      } catch (error) {
        console.error("Error borrowing equipment:", error);
        alert("Unable to borrow equipment. Please try again later.");
      }
    };

    const loadEquipment = async () => {
      try {
        const docRef = doc(db, "equipments", equipmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          equipment.value = { id: docSnap.id, ...docSnap.data() };
        } else {
          alert("Equipment not found!");
          router.push("/home");
        }
      } catch (error) {
        console.error("Error loading equipment:", error);
      }
    };

    const saveChanges = async () => {
      if (!equipment.value) {
        alert("No equipment loaded to save changes.");
        return;
      }

      try {
        const docRef = doc(db, "equipments", equipment.value.id);
        const { ref, ...updatedFields } = equipment.value; // Exclude unnecessary fields
        await updateDoc(docRef, updatedFields);
        alert("Changes saved successfully!");
        goBack();
      } catch (error) {
        console.error("Error while saving changes:", error);
        alert("Unable to save changes.");
      }
    };

    const goBack = () => {
      router.push("/home");
    };

    onMounted(loadEquipment);

    return {
      equipment,
      errorMessage,
      borrowEquipment,
      saveChanges,
      goBack,
      startDate,
      endDate,
      isAdmin: computed(() => route.path.startsWith("/admin/equipment/")),
    };
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
