import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import RegisterView from '../views/RegisterView.vue'
import EquipmentResearchView from '../views/EquipmentResearchView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import Layout from '@/components/mainLayOut/layout.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
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
