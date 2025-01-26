<!-- Ce composant est utilisé gérer les onglets (equipments et informations de l'utilisateur) sur le profil de l'utilisateur -->

<template>
  <div class="profile-header">
    <!-- Titre principal -->
    <h1 class="profile-title">Profile</h1>

    <!-- Onglets -->
    <nav class="tabs">
      <ul>
        <li :class="{ 'is-active': activeTab === 'userInfo' }" @click="setActiveTab('userInfo')">
          <a>Your personal information</a>
        </li>
        <li
          :class="{ 'is-active': activeTab === 'userEquipment' }"
          @click="setActiveTab('userEquipment')"
        >
          <a>Equipment you borrowed</a>
        </li>
      </ul>
    </nav>

    <!-- Contenu des onglets -->
    <div v-if="activeTab === 'userInfo'">
      <UserInfo :userInfo="userInfo" />
    </div>
    <div v-if="activeTab === 'userEquipment'">
      <UserEquipment v-if="userInfo?.id" :userId="userInfo?.id" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, type Ref } from 'vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserEquipment from '@/views/user/UserEquipment.vue'
import { UserStore } from '@/stores/UserStore.ts'

export default defineComponent({
  name: 'UserProfile',
  components: { UserInfo, UserEquipment },
  setup() {
    const activeTab = ref('userInfo')
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

    /**
     * Définit l'onglet actif.
     *
     * @param {string} tab - Nom de l'onglet à activer.
     */
    const setActiveTab = (tab: string) => {
      activeTab.value = tab
    }

    return {
      activeTab,
      userInfo,
      setActiveTab,
    }
  },
})
</script>

<style scoped>
.profile-header {
  text-align: center;
  padding: 1rem 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2rem;
}

.profile-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

/* Style des onglets */
.tabs {
  display: flex;
  justify-content: center; /* Centre les onglets horizontalement */
  border-bottom: 2px solid #eaeaea;
}

.tabs ul {
  list-style: none;
  padding: 0;
  margin: 0; /* Supprime les marges pour éviter tout décalage */
  display: flex;
  justify-content: center; /* Centre le contenu de la liste */
  gap: 1rem;
}

.tabs li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.tabs li:hover {
  background-color: #f5f5f5;
}

.tabs li.is-active {
  background-color: #c2c2c2;
  color: white;
  font-weight: bold;
}

.tabs li a {
  text-decoration: none;
  color: inherit;
}
</style>
