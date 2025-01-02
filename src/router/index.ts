import { createRouter, createWebHistory } from 'vue-router'
import AuthFormView from '../views/AuthFormView.vue'
import RegisterFormView from '../views/RegisterFormView.vue'
import EquipmentResearchView from '../views/EquipmentResearchView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import Layout from '@/components/mainLayOut/layout.vue'
import AddMaterialView from '../views/AddMaterialView.vue'
import EquipmentDetails from '@/views/admin/EquipmentDetails.vue';
import EquipmentManagement from '@/components/management/EquipmentManagement.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth',
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthFormView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterFormView,
    },
    {
      path: '/home',
      name: 'home',
      component: Layout,
    },
    {
      path: '/equipment-research',
      name: 'equipment-research',
      component: EquipmentResearchView,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: UserProfileView,
    },
    {
      path: '/add-material',
      name: 'add-material',
      component: AddMaterialView,
    },
    {
      path: '/components/management',
      name: 'EquipmentManagement',
      component: EquipmentManagement,
    },
    {
      path: '/admin/equipment/:id', // Route avec un paramètre d'ID
      name: 'EquipmentDetails',
      component: EquipmentDetails,
    },
  ],
})

export default router