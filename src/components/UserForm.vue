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
          @input="validateFirstName"
          placeholder="Enter first name"
          required
        />
        <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name <span class="required">*</span></label>
        <input
          type="text"
          id="lastName"
          class="form-input"
          v-model="form.lastName"
          @input="validateLastName"
          placeholder="Enter last name"
          required
        />
        <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
      </div>

      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input
          type="email"
          id="email"
          class="form-input"
          v-model="form.email"
          @input="validateEmail"
          placeholder="Enter email address"
          required
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="role">Role <span class="required">*</span></label>
        <select id="role" class="form-input" v-model="form.role" @change="validateRole" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <p v-if="errors.role" class="error-message">{{ errors.role }}</p>
      </div>

      <div class="form-group">
        <label for="password">Password <span class="required">*</span></label>
        <input
          type="password"
          id="password"
          class="form-input"
          v-model="form.password"
          @input="validatePassword"
          placeholder="Enter password"
          required
        />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password <span class="required">*</span></label>
        <input
          type="password"
          id="confirmPassword"
          class="form-input"
          v-model="form.confirmPassword"
          @input="validateConfirmPassword"
          placeholder="Confirm password"
          required
        />
        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
      </div>

      <button type="submit" class="submit-button" :disabled="!isFormValid">Add</button>
    </form>
  </div>
</template>

<script lang="ts">
import { validateEmail, validatePassword, validateName, validateRole } from '../utils/validator'
import { RegisterStore } from '../stores/RegisterStore'

export default {
  name: 'UserForm',
  data() {
    return {
      form: {
        lastName: '',
        firstName: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
      },
      errors: {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      },
      fields: [
        { name: 'firstName', validate: validateName, errorMsg: 'Invalid firstname' },
        { name: 'lastName', validate: validateName, errorMsg: 'Invalid name' },
        { name: 'email', validate: validateEmail, errorMsg: 'Invalid email' },
        { name: 'role', validate: validateRole, errorMsg: 'Invalid role' },
        {
          name: 'password',
          validate: validatePassword,
          errorMsg: 'Password length must be between 6 and 20 characters',
        },
        {
          name: 'confirmPassword',
          validate: (value) => value === this.form.password,
          errorMsg: 'Passwords do not match',
        },
      ],
    }
  },
  computed: {
    isFormValid() {
      return this.fields.every((field) => !this.errors[field.name] && this.form[field.name])
    },
  },
  methods: {
    validateField(field) {
      if (field.name === 'confirmPassword') {
        const valid = field.validate(this.form.confirmPassword, this.form.password) // Passe les deux valeurs à la validation
        this.errors[field.name] = valid ? '' : field.errorMsg
      } else {
        const valid = field.validate(this.form[field.name])
        this.errors[field.name] = valid ? '' : field.errorMsg
      }
    },
    handleSubmit() {
      this.fields.forEach((field) => this.validateField(field))

      if (this.isFormValid) {
        const { register, errorMessage } = RegisterStore()

        register(
          this.form.lastName,
          this.form.firstName,
          this.form.role,
          this.form.email,
          this.form.password,
        )

        if (errorMessage) {
          alert('The email already corresponds to a user')
        } else {
          alert('User registered successfully!')
          this.resetForm()
        }
      }
    },
    resetForm() {
      this.form = {
        lastName: '',
        firstName: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
      }
      this.errors = {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      }
    },
  },
}
</script>
