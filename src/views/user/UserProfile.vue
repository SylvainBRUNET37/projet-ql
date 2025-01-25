<!-- Ce composant est utilisé gérer les onglets (equipments et informations de l'utilisateur) sur le profil de l'utilisateur -->

<template>
  <div class="section">
    <div class="container">
      <h1>Your profile</h1>

      <!-- Onglets -->
      <div class="tabs">
        <ul>
          <li :class="{ 'is-active': activeTab === 'userInfo' }" @click="setActiveTab('userInfo')">
            <a>Your personal informations</a>
          </li>
          <li
            :class="{ 'is-active': activeTab === 'userEquipment' }"
            @click="setActiveTab('userEquipment')"
          >
            <a>Equipment you borrowed</a>
          </li>
        </ul>
      </div>

      <!-- Contenu des onglets -->
      <div v-if="activeTab === 'userInfo'">
        <UserInfo :userInfo="userInfo" />
      </div>
      <div v-if="activeTab === 'userEquipment'">
        <UserEquipment v-if="userInfo?.id" :userId="userInfo?.id" />
      </div>
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
.tabs li.is-active {
  background-color: white;
  border: 2px solid #eaeaea;
  border-bottom: none;
}
</style>
