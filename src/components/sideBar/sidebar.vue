<template>
    <CSidebar>
        <CSidebarHeader class="border-bottom">
        <CSidebarBrand>LocaMat</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
        <CNavTitle>Welcome, {{ name }} </CNavTitle>
        <CNavItem href="#" @click="$emit('switchContent', 'EquipmentResearchView')">
            <CIcon customClassName="nav-icon" icon="cil-speedometer"/>Home page
        </CNavItem>
        <CNavGroup>
            <template #togglerContent>
            <CIcon customClassName="nav-icon" icon="cil-puzzle"/> Equipement
            </template>
            <CNavItem  href="#" @click="$emit('switchContent', 'UserEquipment')"> 
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> My equipement
            </CNavItem>
            <CNavItem href="#" @click="$emit('switchContent', 'EquipmentManagement')">
            <span class="nav-icon"><span class="nav-icon-bullet" ></span></span> Equipement management
            </CNavItem>
        </CNavGroup>
        <CNavItem href="#" @click="$emit('switchContent', 'UserManagment')">
            <CIcon customClassName="nav-icon" icon="cil-speedometer"/> User management
        </CNavItem>
        <CNavItem href="#" @click="$emit('switchContent', 'UserProfileView')">
            <CIcon customClassName="nav-icon" icon="cil-speedometer" /> Profile
        </CNavItem>
        </CSidebarNav>
        <CSidebarFooter class="border-top">
        <CSidebarToggler @click="logOut"/>
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
  CBadge,
  CNav
} from '@coreui/vue';

import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers } from '@coreui/icons';
import { getAuth, signOut } from 'firebase/auth';
 
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
      cilLayers,
   };
  },
  data(){
    return {
      name: "User",
    };
  },
  created() {
    this.setUserName(); 
  },

 methods: {
    setUserName() {
      const userName = sessionStorage.getItem('userName');  // Corrected to get the value from sessionStorage
      if (userName) {
        this.name = userName;
      } else {
        this.name = "User";
      }
    },
    logOut() {
      console.log("dans la méthode logOut");
      sessionStorage.clear();
      const authInstance = getAuth();
      signOut(authInstance)
        .then(() => {
          this.$router.push('/Auth');
        })
        .catch((error) => {
          console.error("Erreur lors de la déconnexion", error);
        });
    },
  },
};
</script>
    
