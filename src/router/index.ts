import { createRouter, createWebHistory } from 'vue-router'
import AuthFormView from '../views/AuthFormView.vue'
import RegisterFormView from '../views/RegisterFormView.vue'
import EquipmentResearchView from '../views/EquipmentResearchView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import Layout from '@/components/mainLayOut/layout.vue'

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
  ],
})

export default router
