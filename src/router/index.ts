import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import CreateAccount from '../views/CreateAccount.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Auth,
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccount,
    },
  ],
})

export default router
