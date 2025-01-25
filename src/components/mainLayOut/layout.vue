<template>
  <div class="layout">
    <Sidebar @switchContent="switchContent" />
    <div class="content">
      <component :is="currentContent"> </component>
    </div>
  </div>
</template>
<script>
import EquipmentResearch from '@/views/equipment/EquipmentResearch.vue'
import Sidebar from '../sideBar/sidebar.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserEquipment from '../userProfile/UserEquipment.vue'
import UserInfo from '../userProfile/UserInfo.vue'
import UserManagment from '../management/UserManagment.vue'
import EquipmentManagement from '../management/EquipmentManagement.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    EquipmentResearch,
    UserProfile,
    UserEquipment,
    UserInfo,
    UserManagment,
    EquipmentManagement,
  },
  data() {
    return {
      currentContent: 'EquipmentResearch',
    }
  },
  methods: {
    switchContent(content) {
      console.log('ICI 2 ', content)
      if (typeof content === 'string') {
        this.currentContent = content

        console.log(this.currentContent)
      } else {
        console.error('error type of content ')
      }
    },
  },
}
</script>

<style scoped>
.layout {
  display: flex;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  height: 100vh;
  min-height: 100vh;
}

.content {
  display: flex;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}
</style>
