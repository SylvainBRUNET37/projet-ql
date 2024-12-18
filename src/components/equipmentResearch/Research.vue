<!-- Research.vue -->

<template>
  <section class="section" style="background-color: #d9d9d9; width: 100%; height: 100vh">
    <div class="container">
      <!-- En-tête -->
      <div class="header">
        <h1 class="title has-text-centered welcome-title">Welcome to LocaMat</h1>
        <button @click="handleClick" class="profile-button">Your Profile</button>
      </div>

      <!-- Barre de recherche -->
      <div class="search-bar">
        <input
          class="search-input"
          type="text"
          placeholder="Search for equipment to borrow..."
          v-model="search"
        />
        <button class="search-button"></button>
      </div>

      <div class="columns">
        <!-- Menu des filtres -->
        <div class="column is-one-fifth filter-container">
          <div class="filter-header">
            <p>Filter</p>
            <button class="close-button" @click="clearFilters">✕</button>
          </div>
          <div class="filter-section">
            <p class="filter-title">Type of equipment</p>
            <ul>
              <li><input type="checkbox" /> Phone</li>
              <li><input type="checkbox" /> Computer</li>
              <li><input type="checkbox" /> Tablet</li>
            </ul>
          </div>
          <div class="filter-section">
            <p class="filter-title">Brand</p>
            <ul>
              <li><input type="checkbox" /> Apple</li>
              <li><input type="checkbox" /> Samsung</li>
              <li><input type="checkbox" /> Asus</li>
              <li><input type="checkbox" /> Other brands</li>
            </ul>
          </div>
          <div class="filter-section">
            <p class="filter-title">Status</p>
            <ul>
              <li><input type="checkbox" /> Borrowed</li>
              <li><input type="checkbox" /> Not borrowed</li>
            </ul>
          </div>
        </div>

        <!-- Liste des équipements -->
        <div class="column is-four-fifths equipment-container">
          <div class="equipment-grid">
            <div class="card" v-for="item in equipment" :key="item.id">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="card-content">
                <p class="card-title">{{ item.name }}</p>
                <p class="card-status" :class="{ borrowed: item.status === 'Borrowed' }">
                  {{ item.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { db } from '../../firebase'
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
    clearFilters() {
      this.filters.type = []
      this.filters.brand = []
      this.filters.status = []
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

<style scoped>
/* Conteneur principal */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px; /* Centrer la page */
}

/* En-tête */
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  width: 100%;
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
  background-color: #000;
  border: none;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
}

/* Conteneur des filtres */
.filter-container {
  width: 250px;
  background-color: #f3f3f3;
  padding: 15px;
  border-radius: 10px;
  position: relative;
  left: -30px; /* Ajuster pour éloigner légèrement le filtre */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
}

.filter-title {
  font-weight: bold;
  margin: 10px 0 5px;
}

.filter-section ul {
  list-style: none;
  padding: 0;
}

.filter-section li {
  margin: 5px 0;
}

/* Grille des cartes */
.equipment-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Trois cartes par ligne */
  gap: 30px; /* Espacement entre les cartes */
  margin-left: 50px; /* Décalage pour éloigner les cartes du filtre */
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 15px;
  width: 200px;
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

.card-status {
  font-size: 0.9rem;
  color: green;
}

.card-status.borrowed {
  color: red;
}
</style>
