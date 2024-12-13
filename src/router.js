import AuthExample from './components/AuthExample.vue';
import { createRouter, createWebHistory } from 'vue-router';
import FirestoreExample from './components/FirestoreExample.vue';
import HelloWorld from './components/HelloWorld.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: AuthExample,
    },
    {
        path: '/firestore',
        name: 'FirestoreExample',
        component: FirestoreExample,
    },
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: HelloWorld,
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
import { auth } from './firebase';


router.beforeEach((to, from, next) => {
    const isAuthenticated = !!auth.currentUser; // Vérifiez si l'utilisateur est connecté

    if (to.name === 'FirestoreExample' && !isAuthenticated) {

        next({ name: 'Login' });
    } else {
        next();
    }
});



export default router;