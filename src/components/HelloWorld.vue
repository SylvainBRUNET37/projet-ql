<template>
  <div class="section">
    <div class="container">
      <button class="button is-link mb-4" @click="goBack">Back to search</button>
      <h1 class="title has-text-centered">Your profile</h1>

      <!-- Onglets -->
      <div class="tabs is-centered is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === 'personalInfo' }" @click="activeTab = 'personalInfo'">
            <a>Your personal informations</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'equipment' }" @click="activeTab = 'equipment'">
            <a>Equipment you borrowed</a>
          </li>
        </ul>
      </div>

      <!-- Informations personnelles -->
      <div v-if="activeTab === 'personalInfo'" class="content has-text-centered">
        <p class="mb-4">Need to change something? Ask an administrator!</p>
        <p><strong>Last name:</strong> {{ userInfo.lastName || "Not available" }}</p>
        <p><strong>First name:</strong> {{ userInfo.firstName || "Not available" }}</p>
        <p><strong>Mail:</strong> {{ userInfo.email || "Not available" }}</p>
        <p><strong>ID number:</strong> {{ userInfo.id || "Not available" }}</p>
        <p><strong>Role:</strong> {{ roleLabel }}</p>
      </div>

      <!-- Équipement emprunté -->
      <div class="column">
        <div class="columns is-multiline">
          <!-- Afficher uniquement les téléphones empruntés par l'utilisateur -->
          <div class="column is-one-quarter" v-for="item in borrowedByUser" :key="item.id">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img :src="item.image" :alt="item.name" />
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-6">{{ item.name }}</p>
                <p class="subtitle is-7"
                   :class="{'has-text-success': item.status === 'Not borrowed',
                      'has-text-danger': item.status === 'Borrowed'}">
                  {{ item.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>

import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default {
  name: "UserProfile",
  data() {
    return {
      equipment: [],
      userId: "user1",
      activeTab: "personalInfo", // Onglet actif
      userInfo: {}, // Stocke les informations de l'utilisateur connecté
    };
  },
  methods: {
    async fetchUserInfo() {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {

          const email = currentUser.email;

          // Rechercher un document utilisateur correspondant à l'email
          const querySnapshot = await getDocs(
              query(collection(db, "user1"), where("mail", "==", email))
          );

          if (!querySnapshot.empty) {
            // Récupérer le premier utilisateur trouvé
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Adapter les champs pour correspondre à votre base de données
            this.userInfo = {
              id: userDoc.id, // ID du document
              lastName: userData.user || "Not available", // Nom de famille
              firstName: userData["First name"] || "Not available", // Prénom
              email: userData.mail || "Not available", // Email
              role: userData.Role || "Not available", // Rôle
            };
          } else {
            console.error("Aucun utilisateur trouvé avec cet email dans la collection 'users1'.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        }
      } else {
        console.error("Aucun utilisateur connecté.");
        this.$router.push("/"); // Rediriger vers la page de connexion si non connecté
      }
    },
    goBack() {
      this.$router.push("/firestore"); // Remplacer '/search' par votre route de recherche

    },
  },
  async mounted() {
    await this.fetchUserInfo(); // Récupérer les informations utilisateur au chargement du composant
    await this.fetchEquipment();
  },

  async fetchEquipment() {
  const db = getFirestore();
    try {
      // Simulation de récupération depuis Firestore
      const querySnapshot = await getDocs(collection(db, "Phones"));
      this.equipment = querySnapshot.docs.map((doc) => doc.data());
      console.log("Équipement récupéré :", this.equipment);
    } catch (error) {
      console.error("Erreur lors de la récupération des téléphones :", error);
    }
  },


  computed: {
    borrowedByUser() {

      return this.equipment.filter( (item) => item.BorrowerdId === this.userInfo.id);
    },
    roleLabel() {
      if (this.userInfo.role === 1) {
        return " Borrower";
      } else  {
        return "Administrator";
      }
    },
  },



};
</script>

<style scoped>
.section {
  background-color: #f5f5f5; /* Fond gris clair */
  padding: 2rem;
  border-radius: 8px;
}
</style>



