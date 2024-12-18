<template>
    <CSidebar>
        <CSidebarHeader class="border-bottom">
        <CSidebarBrand>CoreUI</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
        <CNavTitle>Nav Title</CNavTitle>
        <CNavItem href="#">
            <CIcon  customClassName="nav-icon" icon="cil-speedometer"/> Nav item
        </CNavItem>
        <CNavItem href="#">
            <CIcon  customClassName="nav-icon" icon="cil-speedometer"/> With badge
            <CBadge class="ms-auto" color="primary">NEW</CBadge>
        </CNavItem>
        <CNavGroup>
            <template #togglerContent>
            <CIcon  customClassName="nav-icon" icon="cil-puzzle"/> Nav dropdown
            </template>
            <CNavItem href="#">
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> Nav dropdown item
            </CNavItem>
            <CNavItem href="#">
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> Nav dropdown item
            </CNavItem>
        </CNavGroup>
        <CNavGroup>
            <template #togglerContent>
            <CIcon  customClassName="nav-icon" icon="cil-puzzle"/> Nav dropdown2
            </template>
            <CNavItem href="#">
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> Nav dropdown item
            </CNavItem>
            <CNavItem href="#">
            <span class="nav-icon"><span class="nav-icon-bullet"></span></span> Nav dropdown item
            </CNavItem>
        </CNavGroup>
        <CNavItem href="https://coreui.io">
            <CIcon customClassName="nav-icon" icon="cil-cloud-download" /> Download CoreUI
        </CNavItem>
        <CNavItem href="https://coreui.io/pro/">
            <CIcon customClassName="nav-icon" icon="cil-layers" /> Try CoreUI PRO
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
  }
};
</script>
    
