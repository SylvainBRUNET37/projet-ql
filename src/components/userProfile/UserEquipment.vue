<!-- Ce composant est utilisé pour afficher les emprunts en cours et à venir d'un utilisateur -->

<template>
  <div>
    <h1>Borrow List</h1>

    <!-- Emprunts en cours -->
    <h2>Current borrows</h2>
    <ul v-if="currentBorrows.length">
      <li v-for="borrow in currentBorrows" :key="borrow.id" style="list-style-type: none">
        <p><strong>Equipment:</strong> {{ borrow.equipment.name }} ({{ borrow.equipment.type }})</p>
        <p><strong>Description:</strong> {{ borrow.equipment.description }}</p>
        <p><strong>Borrow Date:</strong> {{ formatDate(borrow.borrowDate) }}</p>
        <p><strong>Return date:</strong> {{ formatDate(borrow.returnDate) }}</p>
      </li>
    </ul>
    <!-- Si l'utilisateur n'a pas d'emprunt en cours, affiche un message à la place -->
    <p v-else>No current borrows</p>

    <!-- Emprunts à venir -->
    <h2>Upcoming borrows</h2>
    <ul v-if="upcomingBorrows.length">
      <li v-for="borrow in upcomingBorrows" :key="borrow.id" style="list-style-type: none">
        <p><strong>Equipment:</strong> {{ borrow.equipment.name }} ({{ borrow.equipment.type }})</p>
        <p><strong>Description:</strong> {{ borrow.equipment.description }}</p>
        <p><strong>Borrow Date:</strong> {{ formatDate(borrow.borrowDate) }}</p>
        <p><strong>Return date:</strong> {{ formatDate(borrow.returnDate) }}</p>
      </li>
    </ul>
    <!-- Si l'utilisateur n'a pas d'emprunt futur, affiche un message à la place -->
    <p v-else>No upcoming borrows</p>
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
    const currentBorrows = ref<DocumentData[]>([])
    const upcomingBorrows = ref<DocumentData[]>([])

    // Trie les emprunts par date
    const sortBorrowsByDate = (borrows: DocumentData[]) => {
      return [...borrows].sort((a, b) => {
        const dateA = typeof a.borrowDate === 'number' ? a.borrowDate : a.borrowDate.seconds * 1000
        const dateB = typeof b.borrowDate === 'number' ? b.borrowDate : b.borrowDate.seconds * 1000
        return dateA - dateB
      })
    }

    // Charge les emprunts de l'utilisateur
    const loadUserBorrows = async () => {
      try {
        // Récupère les emprunts de l'utilisateur
        const borrows = await borrowStore.getUserBorrowedEquipments(props.userId)
        const nowDate = Date.now()

        // Récupère les emprunts en cours et les trie par date
        currentBorrows.value = sortBorrowsByDate(
          borrows.filter((borrow) => {
            const borrowDate =
              typeof borrow.borrowDate === 'number'
                ? borrow.borrowDate
                : borrow.borrowDate.seconds * 1000
            return borrowDate <= nowDate
          }),
        )

        // Récupère les emprunts à venir et les trie par date
        upcomingBorrows.value = sortBorrowsByDate(
          borrows.filter((borrow) => {
            const borrowDate =
              typeof borrow.borrowDate === 'number'
                ? borrow.borrowDate
                : borrow.borrowDate.seconds * 1000
            return borrowDate > nowDate
          }),
        )
      } catch (error) {
        console.error('Erreur lors de la récupération des emprunts :', error)
      }
    }

    // Formate les dates pour affichage
    const formatDate = (timestamp: number | { seconds: number }) => {
      const seconds = typeof timestamp === 'number' ? timestamp : timestamp.seconds
      const date = new Date(seconds)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    // Charge les emprunts lorsque le composant est monté
    onMounted(async () => {
      await loadUserBorrows()
    })

    return {
      formatDate,
      upcomingBorrows,
      currentBorrows,
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
