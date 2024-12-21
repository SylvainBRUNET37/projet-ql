
<template>
    <div class="layout">
        <Sidebar @switchContent="switchContent"/>
        <div class="content">
           <component :is="currentContent" />
        </div>
    </div>
</template>

<script>

import EquipmentResearchView from "@/views/EquipmentResearchView.vue";
import Sidebar from "../sideBar/sidebar.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import UserEquipment from "../userProfile/UserEquipment.vue";
import UserInfo from "../userProfile/UserInfo.vue";
import UserManagment from "../management/UserManagment.vue";
import EquipmentManagement from "../management/EquipmentManagement.vue";
export default {
    name: "Layout",
    components: {
    Sidebar,
    EquipmentResearchView,
    UserProfileView,
    UserEquipment,
    UserInfo,
    UserManagment,
    EquipmentManagement,
  },
  data(){
    return {
        currentContent :"EquipmentResearchView"
    }
  },
  methods: {
    switchContent(content){
        this.currentContent = content;
    }
  }
};
</script>

<style scoped>
.layout{
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    
}

.content{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>