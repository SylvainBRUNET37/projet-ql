import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import RegisterView from '../views/RegisterView.vue'
import EquipmentResearchView from '../views/EquipmentResearchView.vue'
import UserProfileView from '../views/UserProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
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
