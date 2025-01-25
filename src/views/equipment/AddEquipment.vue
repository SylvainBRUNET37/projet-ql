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
import GenericForm from '@/components/form/GenericForm.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'

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
      // Champs de formulaire
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter equipment name',
          validate: validateNotEmpty,
          errorMsg: 'Name is required',
          required: true,
        },
        {
          name: 'ref',
          label: 'Reference',
          type: 'select',
          placeholder: '',
          validate: validateNotEmpty,
          errorMsg: 'Reference is required',
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
          placeholder: 'Enter equipment type',
          validate: validateNotEmpty,
          errorMsg: 'Type is required',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          placeholder: 'Enter description',
          validate: validateNotEmpty,
          errorMsg: 'Description is required',
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

        // Réinitialise le formulaire après ajout et affiche un message de succès
        Object.keys(this.form).forEach((key) => (this.form[key] = ''))
        alert('Equipment added successfully!')

        // Redirige l'utilisateur vers la page d'accueil
        this.$router.push('/home')
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
      const isValid = field.validate(this.form[field.name as keyof typeof this.form])
      this.errors[field.name] = isValid ? '' : field.errorMsg
    },
  },
}
</script>
