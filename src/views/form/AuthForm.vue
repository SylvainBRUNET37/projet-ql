<!-- Formulaire d'authentification -->

<template>
  <div id="form-container">
    <div class="form">
      <h1 class="form-title">Login</h1>

      <!-- Champs du formulaire -->
      <form @submit.prevent="handleLogin">
        <GenericForm
          v-for="field in fields"
          :key="field.name"
          :field="field"
          v-model="form[field.name]"
          :errors="errors"
          @blur="handleFieldBlur"
        />

        <!-- Bouton de soumission -->
        <button type="submit" class="form-submit-button" :disabled="!isFormValid">Login</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import GenericForm from '@/components/form/GenericForm.vue'
import { validateEmail, validatePassword } from '@/utils/Validator.ts'
import { AuthStore } from '@/stores/AuthStore.ts'

import '@/assets/styles/form.css' // Import du style CSS pour le formulaire

// Définition des types pour les messages d'erreur
type ErrorMessages = {
  [key: string]: string
}

// Définition des types pour les champs de formulaire
type ValidationField = {
  name: string // Nom du champ
  label: string // Label du champ
  type: string // Type du champ (text, email, password, etc.)
  placeholder: string // Texte d'exemple à afficher dans le champ
  validate: (value: string) => boolean // Fonction de validation du champ
  errorMsg: string // Message d'erreur à afficher si la validation échoue
  required?: boolean // Indique si le champ est obligatoire
}

export default {
  name: 'AuthForm',
  components: {
    GenericForm,
  },
  data() {
    return {
      // Formulaire
      form: {
        email: '',
        password: '',
      } as { [key: string]: string },
      // Erreurs de validation
      errors: {} as ErrorMessages,
      // Messages
      errorMessage: '',
      successMessage: '',
      // Champs de formulaire
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          validate: validateEmail,
          errorMsg: 'Invalid email',
          required: true,
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          validate: validatePassword,
          errorMsg: 'Invalid password',
          required: true,
        },
      ] as ValidationField[],
    }
  },
  computed: {
    /**
     * Vérifie si le formulaire est valide.
     *
     * @returns {boolean} - Retourne true si le formulaire est valide, false sinon.
     */
    isFormValid(): boolean {
      return this.fields.every(
        (field) => !this.errors[field.name] && this.form[field.name as keyof typeof this.form],
      )
    },
  },
  methods: {
    /**
     * Gère la soumission du formulaire.
     */
    async handleLogin() {
      this.errorMessage = ''
      this.successMessage = ''

      // Valide tous les champs avant soumission
      this.fields.forEach((field) => this.validateField(field))

      // Vérifie si le formulaire est valide
      if (!this.isFormValid) {
        this.errorMessage = 'Please fill out the form correctly.'
        return
      }

      try {
        // Effectue la connexion
        const authStore = AuthStore()
        await authStore.login(this.form.email, this.form.password)

        // Affiche un message de succès ou d'erreur
        if (authStore.errorMessage) {
          this.errorMessage = authStore.errorMessage
          alert(this.errorMessage)
        } else {
          if (authStore.userData) {
            const user = {
              userName: authStore.userData.firstName,
              role: authStore.userData.role,
            }
            sessionStorage.setItem('user', JSON.stringify(user))
          }
          if (authStore.userData) {
            this.$router.push('/home')
          }
        }
      } catch {
        this.errorMessage = 'An error occurred during login. Please try again.'
      }
    },

    /**
     * Gère la validation d'un champ lorsque l'utilisateur quitte le champ.
     *
     * @param {ValidationField} field - Le champ à valider.
     */
    handleFieldBlur(field: ValidationField) {
      this.validateField(field)
    },

    /**
     * Valide un champ donné.
     *
     * @param {ValidationField} field - Le champ à valider.
     */
    validateField(field: ValidationField): void {
      // Récupère la valeur du champ
      const value = this.form[field.name as keyof typeof this.form]

      // Vérifie si le champ est vide
      if (!value) {
        this.errors[field.name] = 'Please complete this field'
        return
      }

      // Vérifie si le champ est valide
      const isValid = field.validate(this.form[field.name as keyof typeof this.form])
      this.errors[field.name] = isValid ? '' : field.errorMsg
    },
  },
}
</script>
