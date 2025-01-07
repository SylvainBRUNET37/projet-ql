
<template>
    <div class="layout">
        <Sidebar @switchContent="switchContent"/>
        <div class="content">
          <component  :is="currentContent" 
                      :currentId="currentId"
                      @switchContent="handleContent"
                      @setId="handleId">
          </component>
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
        currentContent :"EquipmentResearchView",
        currentId:null,
    }
  },
  methods: {
    switchContent(content){
      console.log("ICI 2 ", content);
      if(typeof content === 'string'){
        this.currentContent = content;
         
        console.log(this.currentContent);
      } else {
        console.error("error type of content ")
      }
    },
    setId(id){
      if(id && typeof id === 'string'){
        this.currentId = id;
        console.log("ID SET TO ", this.currentId)
      }
    }
  },
};
</script>

<style scoped>
.layout{
    display: flex;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 100vh;
    min-height: 100vh
}

.content{
  display: flex;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}
</style>