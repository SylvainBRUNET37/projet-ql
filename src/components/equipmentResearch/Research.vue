<template>
  <div class="SecondLayout">
    <!-- Colonne des filtres -->
    <div class="filter-container">
      <h3>Filtres</h3>
      <!-- Ajouter ici vos options de filtre -->
      <div class="column is-one-quarter">
          <aside class="menu">
            <p class="menu-label">Type of equipment</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox" value="Phone" />
                  Phone
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Computer" />
                  Computer
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Tablet" />
                  Tablet
                </label>
              </li>
            </ul>

            <p class="menu-label">Brand</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox"  value="Apple" />
                  Apple
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox"  value="Samsung" />
                  Samsung
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Asus" />
                  Asus
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Other brand " />
                  Other brand
                </label>
              </li>
            </ul>

            <p class="menu-label">Status</p>
            <ul class="menu-list">
              <li>
                <label>
                  <input type="checkbox"  value="Borrowed" />
                  Borrowed
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" value="Not borrowed" />
                  Not borrowed
                </label>
              </li>
            </ul>
          </aside>
        </div>
        </div>


      

    <!-- Contenu principal -->
    <div class="content-container">
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

      <!-- Liste des équipements -->
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
</template>

<script lang="ts">
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  status: string;
  type: string;
  image: string;
  ref: string;
  Time: Timestamp;
}

export default {
  name: 'EquipmentResearch',
  data() {
    return {
      search: '',
      equipment: [] as Equipment[],
    };
  },
  async created() {
    try {
      const querySnapshot = await getDocs(collection(db, 'Phones'));
      this.equipment = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        brand: doc.data().Brand,
        name: doc.data().Name,
        status: doc.data().Status ? 'Borrowed' : 'Not borrowed',
        type: doc.data().Type,
        image: `/images/${doc.data().image}`,
        ref: doc.data().ref,
        Time: doc.data().Time,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des données Firebase :', error);
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
  height: 100vh;
}

.filter-container {
  background-color: blue;
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
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
