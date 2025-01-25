<!-- UserProfileView.vue -->

<template>
  <div class="section">
    <div class="container">
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

      <!-- Contenu des onglets -->
      <div v-if="activeTab === 'personalInfo'">
        <UserInfo :userInfo="userInfo" />
      </div>
      <div v-if="activeTab === 'equipment'">
        <UserEquipment v-if="userInfo?.id" :userId="userInfo?.id" />
        <p v-else>Loading user equipment...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, type Ref } from 'vue'
import UserInfo from '@/components/userProfile/UserInfo.vue'
import UserEquipment from '@/components/userProfile/UserEquipment.vue'
import { UserStore } from '@/stores/UserStore.ts'

export default defineComponent({
  name: 'UserProfile',
  components: { UserInfo, UserEquipment },
  setup() {
    const activeTab = ref('personalInfo')
    const userStore = UserStore()

    // Informations de l'utilisateur
    const userInfo: Ref<{
      id: string
      lastName: string
      firstName: string
      email: string
      role: string
    } | null> = ref(null)

    // Récupère les informations de l'utilisateur
    onMounted(async () => {
      await userStore.getUserData()
      userInfo.value = userStore.userData as {
        id: string
        lastName: string
        firstName: string
        email: string
        role: string
      }
    })

    return {
      activeTab,
      userInfo,
    }
  },
})
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.section {
  padding: 2rem;
  background-color: #f9f9f9;
  height: 100%;
}

.container {
  max-width: 100%px;
  height: 100%;
  display: flex;
  flex-direction: column;

  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3273dc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #275bb5;
}

h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #363636;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eaeaea;
}

.tabs ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}

.tabs li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px 4px 0 0;
  transition: background-color 0.3s ease;
}

.tabs li:hover {
  background-color: #f2f2f2;
}

.tabs li.is-active {
  background-color: white;
  border: 2px solid #eaeaea;
  border-bottom: none;
}

.tabs a {
  text-decoration: none;
  color: #363636;
  font-weight: bold;
}

/* Content */
.content {
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  color: #4a4a4a;
}

.content strong {
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 1rem;
}

/* Cards */
.columns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.column {
  flex: 1;
  min-width: 220px;
  max-width: 25%;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image img {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 1rem;
  text-align: center;
}

.card-content .title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-content .subtitle {
  font-size: 0.875rem;
  color: #7a7a7a;
}

.card-content .has-text-success {
  color: #23d160;
}

.card-content .has-text-danger {
  color: #ff3860;
}
</style>
