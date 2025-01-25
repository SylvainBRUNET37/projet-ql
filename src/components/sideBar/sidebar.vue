<template>
  <CSidebar>
    <CSidebarHeader class="border-bottom">
      <CSidebarBrand>LocaMat</CSidebarBrand>
    </CSidebarHeader>
    <CSidebarNav>
      <CNavTitle>Welcome, {{ name }} </CNavTitle>
      <CNavItem href="#" @click="$emit('switchContent', 'EquipmentResearch')">
        <CIcon customClassName="nav-icon" icon="cil-speedometer" />Home page
      </CNavItem>
      <CNavGroup v-if="admin">
        <template #togglerContent>
          <CIcon customClassName="nav-icon" icon="cil-puzzle" /> Management
        </template>
        <CNavItem href="#" v-if="admin" @click="$emit('switchContent', 'UserManagment')">
          <span class="nav-icon"><span class="nav-icon-bullet"></span></span> User Management
        </CNavItem>
        <CNavItem href="#" v-if="admin" @click="$emit('switchContent', 'EquipmentManagement')">
          <span class="nav-icon"><span class="nav-icon-bullet"></span></span> Equipement management
        </CNavItem>
      </CNavGroup>
      <CNavItem href="#" @click="$emit('switchContent', 'UserProfile')">
        <CIcon customClassName="nav-icon" icon="cil-speedometer" /> Profile
      </CNavItem>
    </CSidebarNav>
    <CSidebarFooter class="border-top">
      <CSidebarToggler @click="logOut" />
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
  CNav,
} from '@coreui/vue'

import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers } from '@coreui/icons'
import { getAuth, signOut } from 'firebase/auth'
import { auth } from '@/firebase'

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
    CBadge,
  },
  setup() {
    return {
      cilSpeedometer,
      cilPuzzle,
      cilCloudDownload,
      cilLayers,
    }
  },
  data() {
    return {
      name: 'User',
      admin: false,
    }
  },
  created() {
    //avant le rendu de la page
    this.setUserName()
    this.isShown()
  },

  methods: {
    setUserName() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      console.log(user)
      if (user && user.userName) {
        this.name = user.userName
      } else {
        this.name = 'User'
      }
    },
    logOut() {
      console.log('dans la méthode logOut')
      sessionStorage.clear()
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          this.$router.push('/Auth')
        })
        .catch((error) => {
          console.error('Erreur lors de la déconnexion', error)
        })
    },
    isShown() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user && user.role === 'admin') {
        this.admin = true
      }
    },
  },
}
</script>
