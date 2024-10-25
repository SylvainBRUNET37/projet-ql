<!-- src/components/AuthExample.vue -->
<template>
  <div>
    <h1>Authentication Example</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="user">Logged in as: {{ user.email }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';

export default {
  name: 'AuthExample',
  setup() {
    const email = ref('');
    const password = ref('');
    const user = ref(null);

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });

    return {
      email,
      password,
      user,
      login,
    };
  },
};
</script>