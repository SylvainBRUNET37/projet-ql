<!-- UserProfile.vue -->

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

      <!-- Contenu des onglets -->
      <div v-if="activeTab === 'personalInfo'">
        <UserInfo :userInfo="userInfo" />
      </div>
      <div v-if="activeTab === 'equipment'">
        <UserEquipment />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, type Ref } from 'vue'
import UserInfo from './UserInfo.vue'
import UserEquipment from './UserEquipment.vue'
import { UserStore } from '@/stores/UserStore.ts'

export default defineComponent({
  name: 'UserProfile',
  components: { UserInfo, UserEquipment },
  setup() {
    const activeTab = ref('personalInfo')
    const userStore = UserStore()

    // Informations de l'utilisateur
    const userInfo: Ref<{
      lastName: string
      firstName: string
      email: string
      role: string
    } | null> = ref(null)

    // Récupère les informations de l'utilisateur
    onMounted(async () => {
      await userStore.getUserData()
      userInfo.value = userStore.userData as {
        lastName: string
        firstName: string
        email: string
        role: string
      }
    })

    // Redirige l'utilisateur vers la page de recherche de matériel
    const goBack = () => {
      window.location.href = '/equipment-research'
    }

    return {
      activeTab,
      userInfo,
      goBack,
    }
  },
})
</script>
