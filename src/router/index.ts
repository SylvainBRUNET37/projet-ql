import { createRouter, createWebHistory } from 'vue-router';
import AuthFormView from '../views/AuthFormView.vue';
import RegisterFormView from '../views/RegisterFormView.vue';
import EquipmentResearchView from '../views/EquipmentResearchView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import Layout from '@/components/mainLayOut/layout.vue';
import AddMaterialView from '../views/AddMaterialView.vue';
import EquipmentDetails from '@/views/admin/EquipmentDetails.vue';
import EquipmentManagement from '@/components/management/EquipmentManagement.vue';
import UserDetails from '@/views/user/UserDetails.vue';
import UserManagment from '@/components/management/UserManagment.vue';


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
      path: '/components/management',
      name: 'UserManagement',
      component: UserManagment,
    },
    {
      path: '/admin/user/:id', 
      name: 'UserDetails',
      component: UserDetails,
    },
    {
      //see and modify the material
      path: '/admin/equipment/:id',
      name: 'AdminEquipmentDetails',
      component: EquipmentDetails,
    },
    {
      //only to see the material
      path: '/equipment/:id',
      name: 'EquipmentDetails',
      component: EquipmentDetails,
    },

  ],
})

export default router