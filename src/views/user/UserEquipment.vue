<!-- Ce composant est utilisé pour afficher les emprunts en cours et à venir d'un utilisateur -->

<template>
  <div class="container">
    <h1 class="title">Borrow List</h1>

    <!-- Emprunts en cours -->
    <section>
      <h2 class="subtitle">Current borrows</h2>
      <ul v-if="currentBorrows.length" class="borrow-list">
        <li v-for="borrow in currentBorrows" :key="borrow.id" class="borrow-item">
          <p>
            <strong class="label">Equipment:</strong> {{ borrow.equipment.name }} ({{
              borrow.equipment.type
            }})
          </p>
          <p><strong class="label">Description:</strong> {{ borrow.equipment.description }}</p>
          <p><strong class="label">Borrow Date:</strong> {{ formatDate(borrow.borrowDate) }}</p>
          <p><strong class="label">Return date:</strong> {{ formatDate(borrow.returnDate) }}</p>
        </li>
      </ul>
      <p v-else class="empty-state">No current borrows</p>
    </section>

    <!-- Emprunts à venir -->
    <section>
      <h2 class="subtitle">Upcoming borrows</h2>
      <ul v-if="upcomingBorrows.length" class="borrow-list">
        <li v-for="borrow in upcomingBorrows" :key="borrow.id" class="borrow-item">
          <p>
            <strong class="label">Equipment:</strong> {{ borrow.equipment.name }} ({{
              borrow.equipment.type
            }})
          </p>
          <p><strong class="label">Description:</strong> {{ borrow.equipment.description }}</p>
          <p><strong class="label">Borrow Date:</strong> {{ formatDate(borrow.borrowDate) }}</p>
          <p><strong class="label">Return date:</strong> {{ formatDate(borrow.returnDate) }}</p>
        </li>
      </ul>
      <p v-else class="empty-state">No upcoming borrows</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { type DocumentData } from 'firebase/firestore'
import { BorrowStore } from '../../stores/BorrowStore'

/**
 * Composant affichant la liste des emprunts en cours et à venir d'un utilisateur.
 *
 * @prop {string} userId - Identifiant de l'utilisateur dont on récupère les emprunts.
 */
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

    /**
     * Trie les emprunts par date.
     *
     * @param {DocumentData[]} borrows - Liste des emprunts à trier.
     */
    const sortBorrowsByDate = (borrows: DocumentData[]) => {
      // Trie les emprunts par date
      return [...borrows].sort((a, b) => {
        const dateA = typeof a.borrowDate === 'number' ? a.borrowDate : a.borrowDate.seconds * 1000
        const dateB = typeof b.borrowDate === 'number' ? b.borrowDate : b.borrowDate.seconds * 1000
        return dateA - dateB
      })
    }

    /**
     * Charge les emprunts de l'utilisateur.
     */
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
        currentBorrows.value = []
        upcomingBorrows.value = []
      }
    }

    /**
     * Formate une date pour l'affichage.
     *
     * @param {number | { seconds: number }} timestamp - Timestamp ou objet contenant un timestamp.
     * @returns {string} Date formatée en français.
     */
    const formatDate = (timestamp: number | { seconds: number }) => {
      // Récupère le timestamp en secondes
      const seconds = typeof timestamp === 'number' ? timestamp : timestamp.seconds
      const date = new Date(seconds)

      // Retourne la date formatée en français
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
      loadUserBorrows,
    }
  },
})
</script>

<style scoped>
.label {
  color: #007bff;
  font-weight: bold;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #555;
}

.borrow-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.borrow-item {
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.borrow-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

p {
  margin: 0.5rem 0;
  color: #444;
}

.empty-state {
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin: 2rem 0;
}
</style>
