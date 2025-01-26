<template>
  <div class="form-container" v-if="userStore.userData">
    <h1>User Details</h1>
    <form @submit.prevent="saveChanges" class="user-form">
      <div class="form-group">
        <label>First Name:</label>
        <input
          v-model="userStore.userData.firstName"
          class="input-field"
          placeholder="Enter first name"
        />
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input
          v-model="userStore.userData.lastName"
          class="input-field"
          placeholder="Enter last name"
        />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input
          v-model="userStore.userData.email"
          class="input-field"
          placeholder="Enter email"
          @blur="validateEmailField"
        />
        <span v-if="emailError" class="error">{{ emailError }}</span>
      </div>
      <div class="form-group">
        <label>Role:</label>
        <select v-model="userStore.userData.role" class="dropdown">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <span v-if="roleError" class="error">{{ roleError }}</span>
      </div>
      <div class="form-group">
        <label>Status:</label>
        <select v-model="userStore.userData.status" class="dropdown">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="button cancel" @click="goBack">Back</button>
        <button type="submit" class="button save" @click="saveChanges">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { validateEmail, validateRole } from '@/utils/Validator'
import { UserStore } from '@/stores/UserStore'

export default {
  setup() {
    const route = useRoute()
    const userId = ref(route.params.id)

    console.log('ID USER ', userId)
    const userStore = UserStore()

    const localUserData = ref(null)
    // Charger les données utilisateur lorsque le composant est monté
    onMounted(() => {
      userStore.getUserById(userId.value)
      localUserData.value = { ...userStore.userData }
    })

    // Observer les changements du paramètre id dans la route
    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          // Si l'ID a changé
          userId.value = newId
          userStore.getUserById(userId.value) // Recharger les données lorsque l'ID change
        }
      },
    )

    return {
      userStore, // Rendre userStore accessible dans le template
      localUserData,
    }
  },

  methods: {
    validateEmailField() {
      if (!validateEmail(this.localUserData.email)) {
        this.emailError = 'Invalid email format'
      } else {
        this.emailError = ''
      }
    },
    validateRoleField() {
      if (!validateRole(this.localUserData.role)) {
        this.roleError = 'Invalid role. Must be "user" or "admin".'
      } else {
        this.roleError = ''
      }
    },
    async saveChanges() {
      this.validateEmailField()
      this.validateRoleField()
      try {
        const OlddUserData = {
          id: this.localUserData.id,
          email: this.localUserData.email,
          firstName: this.localUserData.firstName,
          lastName: this.localUserData.lastName,
          role: this.localUserData.role,
          status: this.localUserData.status,
        }
        console.log('new ', this.userStore.userData, 'old ', OlddUserData)
        await this.userStore.updateUser(OlddUserData, this.userStore.userData)
        if (
          this.userStore.errorMessage.includes(
            'This email is already in use. Please use a different email.',
          )
        ) {
          // Si l'erreur est liée à l'email, on n'effectue pas la redirection
          alert(this.userStore.errorMessage)
        } else {
          // Si tout se passe bien, on redirige
          alert('Changes saved successfully')
          this.goBack()
        }
      } catch (error) {
        alert(this.userStore.errorMessage)
        console.error('Error while saving changes:', this.userStore.errorMessage)
      }
    },
    goBack() {
      this.$router.push('/home')
    },
  },
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(to bottom right, #ffffff, #f2f2f2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.input-field,
.dropdown {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.2s ease-in-out;
}

.input-field:focus,
.dropdown:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button.save {
  background-color: #007bff;
  color: #fff;
}

.button.save:hover {
  background-color: #0056b3;
}

.button.cancel {
  background-color: #f44336;
  color: #fff;
}

.button.cancel:hover {
  background-color: #d32f2f;
}
</style>
