import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Register from '../views/Register.vue'
import Research from '../components/Research.vue'
import UserProfile from '../components/UserProfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Auth,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
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
