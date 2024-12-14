import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import RegisterView from '../views/RegisterView.vue'
import Research from '../components/research/Research.vue'
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
      path: '/research',
      name: 'research',
      component: Research,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: UserProfileView,
    },
  ],
})

export default router
