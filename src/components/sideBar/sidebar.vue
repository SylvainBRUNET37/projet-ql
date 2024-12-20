<template>
    <CSidebar>
        <CSidebarHeader class="border-bottom">
        <CSidebarBrand>LocaMat</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
        <CNavTitle>Welcome, user</CNavTitle>
        <CNavItem href="#" @click="$emit('switchContent', 'EquipmentResearchView')">
            <CIcon customClassName="nav-icon" icon="cil-speedometer"/>Home page
        </CNavItem>
        <CNavGroup>
            <template #togglerContent>
            <CIcon customClassName="nav-icon" icon="cil-puzzle"/> Equipement
            </template>
            <CNavItem  href="#"> <!--@click="$emit('switchContent', 'myEquipement')"-->
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> My equipement
            </CNavItem>
            <CNavItem href="#">
            <span @click="$emit('switchContent', 'UserEquipment')" class="nav-icon"><span class="nav-icon-bullet" ></span></span> Equipement management
            </CNavItem>
        </CNavGroup>
        <CNavItem href="#"> <!--@click="$emit('switchContent', 'userManagement')"-->
            <CIcon customClassName="nav-icon" icon="cil-speedometer"/> User management
        </CNavItem>
        <CNavItem href="#" @click="$emit('switchContent', 'UserProfileView')">
            <CIcon customClassName="nav-icon" icon="cil-speedometer" /> Profile
        </CNavItem>
        </CSidebarNav>
        <CSidebarFooter class="border-top">
        <CSidebarToggler/>
        </CSidebarFooter>
    </CSidebar>
</template>

<script>
import {
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CSidebarFooter,
  CSidebarToggler,
  CNavItem,
  CNavTitle,
  CNavGroup,
  CBadge
} from '@coreui/vue';

import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers } from '@coreui/icons';

export default {
  name: 'Sidebar',
  components: {
    CSidebar,
    CSidebarHeader,
    CSidebarBrand,
    CSidebarNav,
    CSidebarFooter,
    CSidebarToggler,
    CNavItem,
    CNavTitle,
    CNavGroup,
    CBadge
  },
  setup() {
    return {
      cilSpeedometer,
      cilPuzzle,
      cilCloudDownload,
      cilLayers
    };
  },
}
</script>
    
