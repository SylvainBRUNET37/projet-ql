<template>
  <div>
    <h1>Users Management</h1>
    <table class="table is-hoverable">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Email</th>
          <th>Details</th>
          <th>Disable</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="button is-link" @click="viewUser(user)">Details</button>
          </td>
          <td>
            <button class="button is-link" @click="changeUserStatusHandler(user.id, user.status)">
              Change Status
            </button>
          </td>
          <td>
            <button class="button is-link" @click="handleDelete(equipment.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a
        :class="{ 'pagination-previous': true, 'is-disabled': isFirstPage }"
        @click="goToPreviousPage"
      >
        Previous
      </a>
      <a :class="{ 'pagination-next': true, 'is-disabled': isLastPage }" @click="goToNextPage">
        Next page
      </a>
      <ul class="pagination-list">
        <li>
          <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">
            Page {{ currentPage }} of {{ totalPages }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="add-button-container">
    <button class="button is-primary" @click="handleAdd">Add</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { getUsers, changeUserStatus } from '@/services/userService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const users = ref([])
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const router = useRouter()

    // Pagination logic
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      return users.value.slice(start, start + itemsPerPage.value)
    })

    const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage.value))

    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    const handleDelete = () => {}

    const handleAdd = () => {
      router.push('/register')
    }

    // Fetch users from Firestore
    const fetchUsers = async () => {
      try {
        users.value = await getUsers()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    // Change user status
    const changeUserStatusHandler = async (id, currentStatus) => {
      try {
        console.log(`Changing status for user ID: ${id}`)
        await changeUserStatus(id, currentStatus)

        // Update status locally
        users.value = users.value.map((user) =>
          user.id === id
            ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
            : user,
        )

        alert('User status updated successfully!')
      } catch (error) {
        console.error('Error changing user status:', error)
        alert('An error occurred while changing the user status.')
      }
    }

    // View user details
    const viewUser = (user) => {
      router.push(`/admin/user/${user.id}`)
    }

    // Pagination controls
    const goToPreviousPage = () => {
      if (!isFirstPage.value) currentPage.value--
    }

    const goToNextPage = () => {
      if (!isLastPage.value) currentPage.value++
    }

    // Fetch users on mount
    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      currentPage,
      itemsPerPage,
      paginatedUsers,
      totalPages,
      isFirstPage,
      isLastPage,
      changeUserStatusHandler,
      viewUser,
      goToPreviousPage,
      goToNextPage,
      handleAdd,
      handleDelete,
    }
  },
})
</script>

<style scoped>
.table {
  --bulma-table-color: hsl(221deg, 14%, 10%);
  --bulma-table-background-color: hsl(221, 14%, 100%);
  --bulma-table-cell-border-color: hsl(0, 0%, 38%, 0.033);
  --bulma-table-row-hover-background-color: hsla(0, 0%, 38%, 0.033);
}

.add-button-container {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
