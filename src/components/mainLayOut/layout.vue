<template>
  <section class="hero is-succes is-fullheight">
      <div class="layout">
        <Sidebar @switchContent="switchContent" />
        
          <div class="content">
            <component :is="currentContent"> </component>
          </div>
      </div>
  </section>
  
</template>
<script>
import EquipmentResearch from '@/views/equipment/EquipmentResearch.vue'
import Sidebar from '../sideBar/sidebar.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserEquipment from '../../views/user/UserEquipment.vue'
import UserInfo from '../../views/user/UserInfo.vue'
import UserManagment from '../../views/user/UserManagment.vue'
import EquipmentManagement from '../../views/equipment/EquipmentManagement.vue'

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
  height: 100%; /* Prend toute la hauteur disponible */
  min-height: 100vh; /* Minimum égal à la hauteur de la fenêtre */
  overflow: hidden; /* Empêche les débordements */
}

.content {
  display: flex;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}

.hero {
background-color: white;
}
</style>
