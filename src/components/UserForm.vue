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
          @blur="
            validateField({
              name: 'firstName',
              validate: validateName,
              errorMsg: 'Invalid firstname',
            })
          "
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
          @blur="
            validateField({
              name: 'lastName',
              validate: validateName,
              errorMsg: 'Invalid name',
            })
          "
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
          @blur="
            validateField({
              name: 'email',
              validate: validateEmail,
              errorMsg: 'Invalid email',
            })
          "
          placeholder="Enter email address"
          required
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="role">Role <span class="required">*</span></label>
        <select
          id="role"
          class="form-input"
          v-model="form.role"
          @change="
            validateField({
              name: 'role',
              validate: validateRole,
              errorMsg: 'Invalid role',
            })
          "
          required
        >
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
          @blur="
            validateField({
              name: 'password',
              validate: validatePassword,
              errorMsg: 'Password length must be between 6 and 20 characters',
            })
          "
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
          @blur="
            validateField({
              name: 'confirmPassword',
              validate: (value) => value === form.password,
              errorMsg: 'Passwords do not match',
            })
          "
          placeholder="Confirm password"
          required
        />
        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
      </div>

      <button type="submit" class="submit-button" :disabled="!isFormValid">Add</button>
    </form>

    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script lang="ts">
import { validateEmail, validatePassword, validateName, validateRole } from '../utils/validator'
import { RegisterStore } from '../stores/RegisterStore.ts'

// Define interfaces for form data
interface FormData {
  firstName: string
  lastName: string
  email: string
  role: string
  password: string
  confirmPassword: string
}

// Define interfaces for error messages
interface ErrorMessages {
  firstName: string
  lastName: string
  email: string
  role: string
  password: string
  confirmPassword: string
}

// Define the structure of the field validation
interface ValidationField {
  name: keyof FormData
  validate: (value: string, otherValue?: string) => boolean
  errorMsg: string
}

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
      } as FormData,
      errors: {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      } as ErrorMessages,
      successMessage: '',
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
          validate: (value: string, otherValue?: string) => value === otherValue,
          errorMsg: 'Passwords do not match',
        },
      ] as ValidationField[],
    }
  },
  computed: {
    isFormValid(): boolean {
      return this.fields.every((field) => !this.errors[field.name] && this.form[field.name])
    },
  },
  methods: {
    // Declare the validation methods explicitly
    validateEmail(value: string): boolean {
      return validateEmail(value)
    },
    validatePassword(value: string): boolean {
      return validatePassword(value)
    },
    validateName(value: string): boolean {
      return validateName(value)
    },
    validateRole(value: string): boolean {
      return validateRole(value)
    },

    validateField(field: ValidationField): void {
      const valid =
        field.name === 'confirmPassword'
          ? field.validate(this.form.confirmPassword, this.form.password)
          : field.validate(this.form[field.name])

      this.errors[field.name] = valid ? '' : field.errorMsg
    },
    handleSubmit(): void {
      // Validate all fields before submitting
      this.fields.forEach((field) => this.validateField(field))

      if (this.isFormValid) {
        const { register, errorMessage } = RegisterStore()

        // Call the register method
        register(
          this.form.lastName,
          this.form.firstName,
          this.form.role,
          this.form.email,
          this.form.password,
        )

        if (errorMessage) {
          this.errors.email = 'The email already corresponds to a user'
        } else {
          this.successMessage = 'User registered successfully!'
          this.resetForm()
        }
      }
    },
    resetForm(): void {
      this.form = {
        lastName: '',
        firstName: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: '',
      } as FormData
      this.errors = {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      } as ErrorMessages
    },
  },
}
</script>
