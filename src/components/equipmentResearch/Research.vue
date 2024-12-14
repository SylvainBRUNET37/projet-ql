<template>
  <div>
    <input v-model="search" placeholder="Search equipment" />
    <div>
      <label>
        Type:
        <select v-model="filters.type">
          <option value="">All</option>
          <option value="type1">Type 1</option>
          <option value="type2">Type 2</option>
        </select>
      </label>
      <label>
        Brand:
        <select v-model="filters.brand">
          <option value="">All</option>
          <option value="brand1">Brand 1</option>
          <option value="brand2">Brand 2</option>
        </select>
      </label>
      <label>
        Status:
        <select v-model="filters.status">
          <option value="">All</option>
          <option value="Borrowed">Borrowed</option>
          <option value="Not borrowed">Not borrowed</option>
        </select>
      </label>
    </div>
    <ul>
      <li v-for="item in filteredEquipment" :key="item.id">
        <img :src="item.image" alt="Equipment Image" />
        <p>{{ item.name }}</p>
        <p>{{ item.brand }}</p>
        <p>{{ item.status }}</p>
        <button @click="openModal(item)">Borrow</button>
      </li>
    </ul>
    <div v-if="isModalVisible">
      <div class="modal">
        <h2>Borrow {{ selectedPhone.name }}</h2>
        <input v-model="inputNumber" placeholder="Enter number of hours" />
        <button @click="toggleBorrowStatus(selectedPhone)">Confirm</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { db } from '../../firebase.ts'
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'

export interface Equipment {
  id: string
  name: string
  brand: string
  status: string
  type: string
  image: string
  ref: string
  Time: Timestamp
}

export interface Phone {
  id: string
  name: string
  brand: string
  status: string
  type: string
  image: string
  ref: string
  Time: Timestamp
}

export default {
  name: 'EquipmentResearch',
  data() {
    return {
      search: '',
      filters: {
        type: [] as string[],
        brand: [] as string[],
        status: [] as string[],
      },
      isModalVisible: false,
      selectedPhone: {
        id: '',
        name: '',
        brand: '',
        status: '',
        type: '',
        image: '',
        ref: '',
        Time: Timestamp.now(),
      } as Equipment,
      inputNumber: '',
      equipment: [] as Equipment[],
    }
  },
  methods: {
    handleClick() {
      this.$router.push('/user-profile')
    },
    openModal(phone: Phone) {
      this.selectedPhone = phone
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.selectedPhone = {
        id: '',
        name: '',
        brand: '',
        status: '',
        type: '',
        image: '',
        ref: '',
        Time: Timestamp.now(),
      }
      this.inputNumber = ''
    },
    async toggleBorrowStatus(item: Equipment) {
      // Afficher la valeur et le type de l'entrée
      console.log('User input:', this.inputNumber) // Affiche la valeur brute
      console.log('Type of input:', typeof this.inputNumber) // Affiche le type de la valeur

      // Convertir l'entrée en nombre
      const number = Number(this.inputNumber)
      console.log('Converted number:', number) // Affiche le nombre converti

      // Vérification si la conversion est valide
      if (isNaN(number)) {
        console.log('Input is not a valid number.')
        alert('Please enter a valid positive number.')
        return
      }

      // Vérification si le nombre est positif
      if (number <= 0) {
        console.log('Input is not a positive number.')
        alert('Please enter a valid positive number.')
        return
      }

      // Calculer l'heure actuelle pour Time (heure de début)
      const currentTimestamp = new Date() // Heure actuelle
      // Créer un Timestamp Firebase pour Time
      const firebaseTimestamp = Timestamp.fromDate(currentTimestamp)

      // Calculer l'heure de fin (TimeEnd) en ajoutant la durée de l'emprunt
      const endTimestamp = new Date(currentTimestamp) // Cloner la date actuelle
      endTimestamp.setHours(endTimestamp.getHours() + number) // Ajouter les heures de durée d'emprunt

      // Créer un Timestamp Firebase pour TimeEnd
      const firebaseEndTimestamp = Timestamp.fromDate(endTimestamp)

      const itemRef = doc(db, 'Phones', item.id) // Accéder au document de l'équipement

      await updateDoc(itemRef, {
        status: 'Borrowed', // Mettre à jour le statut
        BorrowerId: item.id,
        Time: firebaseTimestamp, // Enregistrer l'heure de début
        TimeEnd: firebaseEndTimestamp, // Enregistrer l'heure de fin
      })
    },
  },

  async created() {
    try {
      const querySnapshot = await getDocs(collection(db, 'Phones'))
      this.equipment = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        brand: doc.data().Brand,
        name: doc.data().Name,
        status: doc.data().Status ? 'Borrowed' : 'Not borrowed',
        type: doc.data().Type,
        image: `/images/${doc.data().image}`,
        ref: doc.data().ref,
        Time: doc.data().Time,
      }))
    } catch (error) {
      console.error('Erreur lors de la récupération des données Firebase :', error)
    }
  },

  computed: {
    filteredEquipment() {
      return this.equipment.filter((item) => {
        const matchesSearch =
          this.search === '' || item.name.toLowerCase().includes(this.search.toLowerCase())
        const matchesType = this.filters.type.length === 0 || this.filters.type.includes(item.type)
        const matchesBrand =
          this.filters.brand.length === 0 || this.filters.brand.includes(item.brand)
        const matchesStatus =
          this.filters.status.length === 0 || this.filters.status.includes(item.status)
        return matchesSearch && matchesType && matchesBrand && matchesStatus
      })
    },
  },
}
</script>
