<template>
  <div class="section">
    <div class="container">
      <button class="mb-4" @click="goBack">Back to search</button>
      <h1>Your profile</h1>

      <!-- Onglets -->
      <div class="tabs">
        <ul>
          <li
            :class="{ 'is-active': activeTab === 'personalInfo' }"
            @click="activeTab = 'personalInfo'"
          >
            <a>Your personal informations</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'equipment' }" @click="activeTab = 'equipment'">
            <a>Equipment you borrowed</a>
          </li>
        </ul>
      </div>

      <!-- Informations personnelles -->
      <div v-if="activeTab === 'personalInfo'" class="content">
        <p class="mb-4">Need to change something? Ask an administrator!</p>
        <p><strong>Last name:</strong> {{ userInfo.lastName || 'Not available' }}</p>
        <p><strong>First name:</strong> {{ userInfo.firstName || 'Not available' }}</p>
        <p><strong>Mail:</strong> {{ userInfo.email || 'Not available' }}</p>
        <p><strong>ID number:</strong> {{ userInfo.id || 'Not available' }}</p>
        <p><strong>Role:</strong> {{ roleLabel }}</p>
      </div>

      <!-- Équipement emprunté -->
      <div class="columns">
        <div class="column" v-for="item in borrowedByUser" :key="item.id">
          <div class="card">
            <div class="card-image">
              <figure>
                <img :src="item.image" :alt="item.name" />
              </figure>
            </div>
            <div class="card-content">
              <p class="title">{{ item.name }}</p>
              <p
                class="subtitle"
                :class="{
                  'has-text-success': item.status === 'Not borrowed',
                  'has-text-danger': item.status === 'Borrowed',
                }"
              >
                {{ item.status }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

export default {
  name: 'UserProfile',
  data() {
    return {
      equipment: [],
      userId: 'user1',
      activeTab: 'personalInfo', // Onglet actif
      userInfo: {}, // Stocke les informations de l'utilisateur connecté
    }
  },
  methods: {
    async fetchUserInfo() {
      const auth = getAuth()
      const db = getFirestore()
      const currentUser = auth.currentUser

      if (currentUser) {
        try {
          const email = currentUser.email

          // Rechercher un document utilisateur correspondant à l'email
          const querySnapshot = await getDocs(
            query(collection(db, 'user1'), where('mail', '==', email)),
          )

          if (!querySnapshot.empty) {
            // Récupérer le premier utilisateur trouvé
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data()

            // Adapter les champs pour correspondre à votre base de données
            this.userInfo = {
              id: userDoc.id, // ID du document
              lastName: userData.user || 'Not available', // Nom de famille
              firstName: userData['First name'] || 'Not available', // Prénom
              email: userData.mail || 'Not available', // Email
              role: userData.Role || 'Not available', // Rôle
            }
          } else {
            console.error("Aucun utilisateur trouvé avec cet email dans la collection 'users1'.")
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur :', error)
        }
      } else {
        console.error('Aucun utilisateur connecté.')
        this.$router.push('/') // Rediriger vers la page de connexion si non connecté
      }
    },
    goBack() {
      this.$router.push('/research') // Remplacer '/search' par votre route de recherche
    },
  },
  async mounted() {
    await this.fetchUserInfo() // Récupérer les informations utilisateur au chargement du composant
    await this.fetchEquipment()
  },

  async fetchEquipment() {
    const db = getFirestore()
    try {
      // Simulation de récupération depuis Firestore
      const querySnapshot = await getDocs(collection(db, 'Phones'))
      this.equipment = querySnapshot.docs.map((doc) => doc.data())
      console.log('Équipement récupéré :', this.equipment)
    } catch (error) {
      console.error('Erreur lors de la récupération des téléphones :', error)
    }
  },

  computed: {
    borrowedByUser() {
      return this.equipment.filter((item) => item.BorrowerdId === this.userInfo.id)
    },
    roleLabel() {
      if (this.userInfo.role === 1) {
        return ' Borrower'
      } else {
        return 'Administrator'
      }
    },
  },
}
</script>
