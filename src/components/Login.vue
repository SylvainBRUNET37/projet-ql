<template>
  <div class="login-container">
    <h1>Welcome to LocaMat</h1>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Login</label>
        <input type="email" v-model="email" placeholder="Enter your login" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <div class="password-container">
          <input type="password" v-model="password" placeholder="Enter password" required />
          <span class="show-password">👁️</span>
        </div>
      </div>
      <p class="forgot-password">
        <a href="#" @click.prevent="forgotPassword">Forgot password?</a>
      </p>
      <button type="submit" class="login-button">Sign in</button>
    </form>
    <p v-if="user">Logged in as: {{ user.email }}</p>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'AuthExample',
  setup() {
    const email = ref('')
    const password = ref('')
    const user = ref(null)
    const errorMessage = ref('')

    // Fonction de connexion
    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        user.value = userCredential.user
        errorMessage.value = 'Login successfully'
      } catch (error) {
        console.error('Error logging in:', error.message)
        errorMessage.value = `Errror: ${error.code} - ${error.message}`
      }
    }

    // Observer l'état de l'utilisateur connecté
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
    })

    return {
      email,
      password,
      user,
      errorMessage,
      login,
    }
  },
}
</script>

<style>
/* Conteneur principal */
.login-container {
  background-color: #f0f0f0; /* Couleur de fond */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px; /* Taille fixe pour le formulaire */
  margin: 50px auto; /* Centré sur la page */
  text-align: center;
}

/* Titre principal */
.login-container h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

/* Groupes d'entrée */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Conteneur du mot de passe */
.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.password-container input {
  flex: 1;
}

.show-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 16px;
}

/* Bouton de connexion */
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.login-button:hover {
  background-color: #0056b3;
}

/* Lien mot de passe oublié */
.forgot-password {
  margin-top: 10px;
  text-align: left;
}

.forgot-password a {
  color: #007bff;
  font-size: 14px;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
