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
        <BorrowedEquipments />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, type Ref } from 'vue'
import UserInfo from './UserInfo.vue'
import BorrowedEquipments from './BorrowedEquipments.vue'
import { UserStore } from '@/stores/UserStore.ts'

export default defineComponent({
  name: 'UserProfile',
  components: { UserInfo, BorrowedEquipments },
  setup() {
    const activeTab = ref('personalInfo')
    const userStore = UserStore()

    const userInfo: Ref<{
      lastName: string
      firstName: string
      email: string
      role: string
    } | null> = ref(null)

    onMounted(async () => {
      await userStore.getUserData()
      userInfo.value = userStore.userData as {
        lastName: string
        firstName: string
        email: string
        role: string
      }

      console.log('userInfo dans UserProfile :', userInfo.value)
    })

    const goBack = () => {
      window.location.href = '/research'
    }

    return {
      activeTab,
      userInfo,
      goBack,
    }
  },
})
</script>
