import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Register from '../views/Register.vue'

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
  ],
})

export default router
