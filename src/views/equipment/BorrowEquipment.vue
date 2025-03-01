<!-- Ce composant permet d'afficher les détails d'un équipement. -->

<template>
  <div class="form-container">
    <h1>Equipment Details</h1>

    <!-- Nom de l'équipement -->
    <div class="form-group">
      <label>Name:</label>
      <input v-model="equipment.name" readonly />
    </div>

    <!-- Reference de l'équipement -->
    <div class="form-group">
      <label>Reference:</label>
      <input v-model="equipment.ref" readonly />
    </div>

    <!-- Type de l'équipement -->
    <div class="form-group">
      <label>Type:</label>
      <input v-model="equipment.type" readonly />
    </div>

    <!-- Status de l'équipement -->
    <div class="form-group">
      <label>Status:</label>
      <input v-model="equipment.status" readonly />
    </div>

    <!-- Description de l'équipement -->
    <div class="form-group">
      <label>Description:</label>
      <input v-model="equipment.description" readonly />
    </div>

    <!-- Champs pour les dates de début et de fin -->
    <div class="date-fields">
      <div class="form-group">
        <label>Start Date:</label>
        <input type="date" v-model="startDate" id="start-date" data-test="start-date" />
      </div>
      <div class="form-group">
        <label>End Date:</label>
        <input type="date" v-model="endDate" id="end-date" data-test="end-date" />
      </div>
    </div>

    <!-- Boutons -->
    <div class="form-actions">
      <!-- Bouton pour revenir en arrière -->
      <button type="button" class="button cancel" @click="goBack">Back</button>

      <!-- Bouton pour emprunter un équipement -->
      <button
        type="button"
        class="button is-primary"
        id="borrow-button"
        data-test="borrow-button"
        @click="borrowEquipment"
      >
        Borrow
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { onMounted, ref } from 'vue'
import { UserStore } from '@/stores/UserStore'
import { BorrowStore } from '@/stores/BorrowStore'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const equipmentId = route.params.id.toString()
    const equipment = ref({
      id: '',
      name: '',
      ref: '',
      type: '',
      status: '',
      description: '',
    })

    let errorMessage = ''
    const userStore = UserStore()
    const borrowStore = BorrowStore()
    const startDate = ref<string | null>(null)
    const endDate = ref<string | null>(null)

    const borrowEquipment = async () => {
      const userId = userStore.getUserId()

      if (equipment.value.status === 'unavailable') {
        alert('You cannot borrow unavailable equipment.')
        return
      }

      if (!userId) {
        alert('You must be logged in to borrow equipment.')
        return
      }

      if (!equipment.value) {
        alert('Equipment details are not loaded yet. Please try again later.')
        return
      }

      if (!startDate.value || !endDate.value) {
        alert('Please provide both start and end dates.')
        return
      }

      const startDateMs = Date.parse(startDate.value)
      const endDateMs = Date.parse(endDate.value)

      borrowStore.borrowEquipment(userId, equipmentId, startDateMs, endDateMs)

      // Affiche un message de succès ou d'erreur
      if (borrowStore.errorMessage) {
        errorMessage = borrowStore.errorMessage
        alert(errorMessage)
      } else {
        alert('Equipment borrowed successfully!')
      }
    }

    const loadEquipment = async () => {
      try {
        const docRef = doc(db, 'equipments', equipmentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as {
            name: string
            ref: string
            type: string
            status: string
            description: string
          }
          equipment.value = { id: docSnap.id, ...data }
        } else {
          alert('Equipment not found!')
          router.push('/home')
        }
      } catch (error) {
        console.error('Error loading equipment:', error)
      }
    }
    const goBack = () => {
      router.push('/home')
    }

    onMounted(loadEquipment)

    return {
      equipment,
      errorMessage,
      goBack,
      startDate,
      endDate,
      borrowEquipment,
    }
  },
}
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

.date-fields {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.date-fields .form-group {
  flex: 1;
  margin-right: 10px;
}

.date-fields .form-group:last-child {
  margin-right: 0;
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

.button.is-primary {
  background-color: #007bff;
  color: white;
}

.button.is-primary:hover {
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
