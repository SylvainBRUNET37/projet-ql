
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

<style scoped>
.layout{
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}
</style>