<template>
  <div id="form-container">
    <div class="form">
      <h1 class="form-title">Add Equipment</h1>

      <!-- Champs du formulaire -->
      <form @submit.prevent="handleAddEquipment">
        <GenericForm
          v-for="field in fields"
          :key="field.name"
          :field="field"
          v-model="form[field.name]"
          :errors="errors"
          @blur="handleFieldBlur"
        />

        <!-- Bouton de soumission -->
        <button type="submit" class="form-submit-button" :disabled="!isFormValid">
          Add Equipment
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import GenericForm from '../../components/form/GenericForm.vue'
import { EquipmentStore } from '../../stores/EquipmentStore'

import '@/assets/styles/form.css' // Import du style CSS pour le formulaire

type ErrorMessages = {
  [key: string]: string
}

type ValidationField = {
  name: string
  label: string
  type: string
  placeholder: string
  validate: (value: string) => boolean
  errorMsg: string
  required?: boolean
}

const validateNotEmpty = (value: string) => value.trim().length > 0

export default {
  name: 'AddEquipment',
  components: {
    GenericForm,
  },
  data() {
    return {
      // Formulaire
      form: {
        name: '',
        ref: '',
        type: '',
        status: 'available',
        description: '',
        image: '',
      } as { [key: string]: string },
      // Erreurs de validation
      errors: {} as ErrorMessages,
      errorMessage: '',
      // Champs de formulaire
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter equipment name',
          validate: this.validateName,
          errorMsg: 'Invalid name',
          required: true,
        },
        {
          name: 'ref',
          label: 'Reference',
          type: 'select',
          placeholder: '',
          validate: validateNotEmpty,
          errorMsg: 'Invalid reference',
          required: true,
          options: [
            { value: 'AP', label: 'IOS' },
            { value: 'AN', label: 'Android' },
            { value: 'XX', label: 'Other' },
          ],
        },
        {
          name: 'type',
          label: 'Type',
          type: 'text',
          placeholder: 'Enter type',
          validate: this.validateType,
          errorMsg: 'Invalid type',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          placeholder: 'Enter description',
          validate: this.validateDescription,
          errorMsg: 'Invalid description',
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
    validateName(name: string) {
      const regex = /^[A-Za-z0-9\-_ ]{1,30}$/
      return regex.test(name)
    },

    validateType(type: string) {
      return this.validateName(type)
    },

    validateDescription(description: string) {
      const regex = /^[A-Za-z0-9\-_ ]{1,200}$/
      return regex.test(description)
    },

    /**
     * Gère la soumission du formulaire.
     */
    async handleAddEquipment() {
      this.errors = {}

      // Valide tous les champs avant soumission
      this.fields.forEach((field) => this.validateField(field))

      if (!this.isFormValid) {
        return
      }

      try {
        const equipmentStore = EquipmentStore()
        await equipmentStore.addEquipment(this.form)

        // Affiche un message de succès ou d'erreur
        if (equipmentStore.errorMessage) {
          this.errorMessage = equipmentStore.errorMessage
          alert(this.errorMessage)
        } else {
          // Redirige l'utilisateur vers la page d'accueil
          this.$router.push('/home')
        }
      } catch {
        alert('An error occurred while adding the equipment.')
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
