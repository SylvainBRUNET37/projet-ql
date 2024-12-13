<!-- src/components/AuthExample.vue -->
<template>
  <div class="login-container">
    <h1>Welcome to LocaMat  </h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Login:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="user">Logged in as: {{ user.email }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p>
      <a href ="#" @click.prevent="forgotPassword">Forgot password</a>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

import { useRouter } from 'vue-router';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVDvx3Ee4YXINQC0a-XwsUmLpIt7Wmcxo",
  authDomain: "my-project-4f301.firebaseapp.com",
  projectId: "my-project-4f301",
  storageBucket: "my-project-4f301.firebasestorage.app",
  messagingSenderId: "288677139782",
  appId: "1:288677139782:web:3bf6eff5824718aca0c147",
  measurementId: "G-JBJYWTHF0C"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default {
  name: 'AuthExample',
  setup() {
    const email = ref('');
    const password = ref('');
    const user = ref(null);
    const errorMessage = ref('');
    const router = useRouter();

    // Fonction de connexion
    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        user.value = userCredential.user;
        errorMessage.value = '';
        console.log('Connexion réussie');
        router.push('/firestore');
      } catch (error) {
        console.error('Error logging in:', error.message);
        errorMessage.value = `Errror: ${error.code} - ${error.message}`;
      }
    };

    // Observer l'état de l'utilisateur connecté
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });

    return {
      email,
      password,
      user,
      errorMessage,
      login,
    };
  },
};
</script>
<style>


/* Conteneur principal */
.login-container {
  background-color: #f5f5f5;
  padding: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 4000px;
  box-sizing: border-box;
  text-align: center;
}

/* Titre principal */
.login-container h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* Champs de formulaire */
.login-container label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
  text-align: left;
}

.login-container input[type="email"],
.login-container input[type="password"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Bouton de connexion */
.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #0056b3;
}

/* Lien mot de passe oublié */
.login-container a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.login-container a:hover {
  text-decoration: underline;
}

/* Messages */
.login-container p {
  font-size: 14px;
  margin-top: 10px;
}

.login-container p[style="color: red;"] {
  color: red;
  font-weight: bold;
}
</style>














