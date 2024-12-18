
<template>
    <div class="layout">
        <Sidebar />
        <div class="content">
            <EquipmentResearchView/>
            <router-view/>
        </div>
    </div>
</template>

<script>

import EquipmentResearchView from "@/views/EquipmentResearchView.vue";
import Sidebar from "../sideBar/sidebar.vue";
export default {
    name: "Layout",
    components: {
    Sidebar,
    EquipmentResearchView
  },
};
</script>
