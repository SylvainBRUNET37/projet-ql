<template>
  <div>
    <h1>Liste des emprunts en cours</h1>

    <!-- Affichage des emprunts -->
    <ul v-if="userLoans.length">
      <li v-for="loan in userLoans" :key="loan.id" style="list-style-type: none">
        <p><strong>Équipement:</strong> {{ loan.equipment.name }} ({{ loan.equipment.type }})</p>
        <p><strong>Description:</strong> {{ loan.equipment.description }}</p>
        <p><strong>Date d'emprunt:</strong> {{ formatDate(loan.borrowDate) }}</p>
        <p><strong>Date de retour:</strong> {{ formatDate(loan.returnDate) }}</p>
      </li>
    </ul>

    <!-- Message lorsqu'il n'y a pas d'emprunts -->
    <p v-else>Aucun emprunt en cours pour cet utilisateur.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { type DocumentData } from 'firebase/firestore'
import { BorrowStore } from '../../stores/BorrowStore'

export default defineComponent({
  name: 'UserEquipment',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const borrowStore = BorrowStore()
    const userLoans = ref<DocumentData[]>([])

    // Charge les emprunts de l'utilisateur
    const loadUserLoans = async () => {
      try {
        userLoans.value = await borrowStore.getUserEquipments(props.userId)
      } catch (error) {
        console.error('Erreur lors de la récupération des emprunts :', error)
      }
    }

    // Formate les dates pour affichage
    const formatDate = (timestamp: number | { seconds: number }) => {
      const seconds = typeof timestamp === 'number' ? timestamp : timestamp.seconds
      const date = new Date(seconds * 1000)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    // Charge les emprunts lorsque le composant est monté
    onMounted(async () => {
      await loadUserLoans()
    })

    return {
      userLoans,
      formatDate,
    }
  },
})
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}

p {
  margin: 0.5rem 0;
}
</style>
