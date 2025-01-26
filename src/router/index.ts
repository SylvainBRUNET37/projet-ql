import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '../views/form/AuthForm.vue'
import RegisterForm from '../views/form/RegisterForm.vue'
import EquipmentResearch from '../views/equipment/EquipmentResearch.vue'
import UserProfile from '../views/user/UserProfile.vue'
import Layout from '@/components/mainLayOut/layout.vue'
import AddEquipment from '../views/equipment/AddEquipment.vue'
import EquipmentDetails from '@/views/equipment/EquipmentDetails.vue'
import EquipmentManagement from '@/views/equipment/EquipmentManagement.vue'
import UserDetails from '@/views/user/UserDetails.vue'
import UserManagment from '@/views/user/UserManagment.vue'
import BorrowEquipment from '@/views/equipment/BorrowEquipment.vue'

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
      component: AuthForm,
    },
    {
      path: '/borrow/:id',
      name: 'borrow',
      component: BorrowEquipment,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
    },
    {
      path: '/home',
      name: 'home',
      component: Layout,
    },
    {
      path: '/equipment-research',
      name: 'equipment-research',
      component: EquipmentResearch,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: UserProfile,
    },
    {
      path: '/add-equipment',
      name: 'add-equipment',
      component: AddEquipment,
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