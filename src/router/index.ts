import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Register from '../views/Register.vue'
import MyButton from '../components/FirestoreExample.vue'

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
      path: '/material',
      name: 'material',
      component: MyButton,
    }
  ],
})

export default router
