<template>
  <div class="auth-form">
    <h2 class="auth-form-title">Create Account</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name <span class="required">*</span></label>
        <input
          type="text"
          id="firstName"
          class="form-input"
          v-model="form.firstName"
          placeholder="Enter first name"
          required
        />
      </div>

      <div class="form-group">
        <label for="lastName">Last Name <span class="required">*</span></label>
        <input
          type="text"
          id="lastName"
          class="form-input"
          v-model="form.lastName"
          placeholder="Enter last name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input
          type="email"
          id="email"
          class="form-input"
          v-model="form.email"
          placeholder="Enter email address"
          required
        />
      </div>

      <div class="form-group">
        <label for="role">Role <span class="required">*</span></label>
        <select id="role" class="form-input" v-model="form.role" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-group">
        <label for="password">Password <span class="required">*</span></label>
        <input
          type="password"
          id="password"
          class="form-input"
          v-model="form.password"
          placeholder="Enter password"
          required
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password <span class="required">*</span></label>
        <input
          type="password"
          id="confirmPassword"
          class="form-input"
          v-model="form.confirmPassword"
          placeholder="Confirm password"
          required
        />
      </div>

      <button type="submit" class="submit-button">Add</button>
    </form>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import '../assets/styles/authForm.css'

export default {
  name: 'CreateAccount',
  setup() {
    return {
      form: {
        lastName: '',
        firstName: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      try {
        // Enregistrement de l'utilisateur dans Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.form.email,
          this.form.password,
        )
        const uid = userCredential.user.uid

        // Sauvegarde des données supplémentaires dans Firestore
        await setDoc(doc(db, 'users', uid), {
          lastName: this.form.lastName,
          firstName: this.form.firstName,
          email: this.form.email,
          role: this.form.role,
          createdAt: new Date().toISOString(),
        })

        alert('User added successfully!')
        // Réinitialiser le formulaire
        this.form = {
          lastName: '',
          firstName: '',
          email: '',
          role: 'user',
          password: '',
          confirmPassword: '',
        }
      } catch (error) {
        console.error('Error creating user:', error)
        alert('Failed to create user: ' + error.message)
      }
    },
  },
}
</script>
