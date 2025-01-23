<!-- RegisterFormView.vue -->
<!-- Formulaire de création de compte -->

<template>
  <div id="form-container">
    <div class="form">
      <!-- Titre du formulaire de création de compte -->
      <h2 class="form-title">Create Account</h2>

      <!-- Formulaire avec gestion de l'événement submit -->
      <form @submit.prevent="handleSubmit">
        <!-- Pour chaque champ du formulaire, créer un composant GenericForm pour l'affichage et la validation -->
        <GenericForm
          v-for="field in fields"
          :key="field.name"
          :field="field"
          v-model="form[field.name]"
          :errors="errors"
          @blur="handleFieldBlur"
        />

        <!-- Bouton de soumission, désactivé si le formulaire n'est pas valide -->
        <button type="submit" class="form-submit-button" :disabled="!isFormValid">Add</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import GenericForm from '../components/form/GenericForm.vue'
import { validateEmail, validatePassword, validateName, validateRole } from '../utils/Validator.ts'
import { RegisterStore } from '../stores/RegisterStore.ts'

import '../assets/styles/form.css' // Import du style CSS pour le formulaire

// Définition des types pour les messages d'erreur
type ErrorMessages = {
  [key: string]: string
}

type ValidationField = {
  name: string // Nom du champ
  label: string // Label du champ
  type: string // Type du champ (text, email, password, etc.)
  placeholder: string // Texte d'exemple à afficher dans le champ
  validate: (value: string, otherValue?: string) => boolean // Fonction de validation du champ
  errorMsg: string // Message d'erreur à afficher si la validation échoue
  required?: boolean // Indique si le champ est obligatoire
  options?: Array<{ value: string; label: string }> // Options possibles pour des champs de type select
}

export default {
  name: 'RegisterFormView',
  components: {
    GenericForm, // Import du composant GenericForm pour gérer chaque champ
  },
  data() {
    return {
      // Données du formulaire (initialisées avec des valeurs vides ou par défaut)
      form: {} as Record<string, string>,
      // Objet pour stocker les erreurs de validation des champs
      errors: {} as ErrorMessages,
      // Liste des champs de formulaire avec leurs validations et messages d'erreur
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          placeholder: 'Enter first name',
          validate: validateName,
          errorMsg: 'Invalid firstname',
          required: true,
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          placeholder: 'Enter last name',
          validate: validateName,
          errorMsg: 'Invalid lastname',
          required: true,
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter email address',
          validate: validateEmail,
          errorMsg: 'Invalid email',
          required: true,
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          placeholder: '',
          validate: validateRole,
          errorMsg: 'Invalid role',
          required: true,
          options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ],
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter password',
          validate: validatePassword,
          errorMsg: 'Password must be between 6 and 20 characters',
          required: true,
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password',
          placeholder: 'Confirm password',
          validate: (value: string, otherValue?: string) => value === otherValue,
          errorMsg: 'Passwords do not match',
          required: true,
        },
      ] as ValidationField[], // Initialisation de la liste des champs avec les règles de validation
    }
  },
  computed: {
    /**
     * Vérifie si tous les champs sont valides et si le formulaire est prêt à être soumis.
     *
     * @returns {boolean} - Retourne true si le formulaire est valide, sinon false.
     */
    isFormValid(): boolean {
      return this.fields.every(
        (field) => !this.errors[field.name] && this.form[field.name as keyof typeof this.form], // Tous les champs doivent être validés et non vides
      )
    },
  },
  methods: {
    /**
     * Met à jour les données du formulaire lorsque l'un de ses champs est modifié.
     *
     * @param {Object} updatedForm - L'objet représentant le formulaire mis à jour.
     * @param {string} updatedForm.firstName - Prénom de l'utilisateur.
     * @param {string} updatedForm.lastName - Nom de l'utilisateur.
     * @param {string} updatedForm.email - Email de l'utilisateur.
     * @param {string} updatedForm.role - Rôle de l'utilisateur (user/admin).
     * @param {string} updatedForm.password - Mot de passe de l'utilisateur.
     * @param {string} updatedForm.confirmPassword - Confirmation du mot de passe.
     */
    updateForm(updatedForm: {
      firstName: string
      lastName: string
      email: string
      role: string
      password: string
      confirmPassword: string
    }) {
      this.form = updatedForm
    },

    /**
     * Gère la validation d'un champ si l'utilisateur quitte le champ.
     *
     * @param {ValidationField} field - Le champ à valider.
     */
    handleFieldBlur(field: ValidationField) {
      this.validateField(field)
    },

    /**
     * Fonction de validation d'un champ spécifique.
     *
     * @param {ValidationField} field - Le champ à valider.
     * @returns {void}
     */
    validateField(field: ValidationField): void {
      const valid =
        field.name === 'confirmPassword'
          ? field.validate(this.form[field.name], this.form.password) // Validation pour le champ confirmPassword
          : field.validate(this.form[field.name as keyof typeof this.form]) // Validation pour les autres champs

      this.errors[field.name] = valid ? '' : field.errorMsg // Si invalide, associe un message d'erreur
    },

    /**
     * Gère la soumission du formulaire après validation des champs.
     *
     * @returns {void}
     */
    async handleSubmit(): Promise<void> {
      // Valide chaque champ du formulaire
      this.fields.forEach((field) => this.validateField(field))

      // Si le formulaire est valide, fait une requête d'inscription
      if (this.isFormValid) {
        const { register } = RegisterStore()

        await register(
          this.form.firstName,
          this.form.lastName,
          this.form.role,
          this.form.email,
          this.form.password,
        )

        const errorMessage = RegisterStore().errorMessage

        // Gestion des erreurs de l'inscription
        if (errorMessage === 'Email is already in use.') {
          this.errors.email = 'Email is already in use.'
        } else {
          if (errorMessage === 'The account has been reactivated.') {
            alert('User successfully reactivated!')
            this.errors.email = 'The account has been reactivated.'
          } else {
            alert('User successfully registered!')
          }

          // Redirige l'utilisateur vers la page d'accueil
          this.$router.push('/home')
        }
      }
    },

    /**
     * Réinitialise le formulaire.
     *
     * @returns {void}
     */
    resetForm(): void {
      // Réinitialise les valeurs du formulaire
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      }
      this.errors = {} as ErrorMessages // Réinitialise les erreurs
    },
  },
}
</script>
