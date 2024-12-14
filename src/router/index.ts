import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import RegisterView from '../views/RegisterView.vue'
import Research from '../components/Research.vue'
import UserProfile from '../components/UserProfil.vue'

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
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: UserProfile,
    },
  ],
})

export default router
