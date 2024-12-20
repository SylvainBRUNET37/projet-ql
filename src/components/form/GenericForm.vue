<!-- GenericForm.vue -->
<!-- Ce composant générique est utilisé pour afficher un champ de formulaire. Il peut être utilisé pour afficher des champs de texte, des champs de sélection, etc. -->

<template>
  <div class="form-group">
    <!-- Rend le champ required si il l'est -->
    <label :for="field.name">
      {{ field.label }} <span v-if="field.required" class="required">*</span>
    </label>

    <!-- Utilise un input ou un select en fonction du type du champ -->
    <component
      :is="field.type === 'select' ? 'select' : 'input'"
      :id="field.name"
      class="form-input"
      :value="localValue"
      v-bind="field.type === 'select' ? {} : { type: field.type }"
      :placeholder="field.placeholder"
      :required="field.required"
      @input="updateValue"
      @blur="handleBlur"
    >
      <!-- Si le champ est de type select, met les différentes options dans le select -->
      <option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </component>

    <!-- Affiche un message d'erreur si le champ est invalide -->
    <p v-if="errors[field.name]" class="error-message">{{ errors[field.name] }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GenericForm',

  props: {
    // Objet contenant les informations du champ de formulaire
    field: {
      type: Object,
      required: true,
    },
    // Objet contenant les erreurs de validation des champs
    errors: {
      type: Object,
      default: () => ({}),
    },
    // Modèle de valeur pour le champ de formulaire
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },

  data() {
    return {
      localValue: this.modelValue || '', // Valeur locale du champ de formulaire
    }
  },

  watch: {
    localValue(newValue) {
      this.$emit('update:modelValue', newValue) // Émet un événement pour mettre à jour la valeur du champ parent
    },
  },

  methods: {
    /**
     * Met à jour la valeur locale lorsque l'utilisateur modifie le champ.
     *
     * @param {Event} event - L'événement d'entrée du champ
     */
    updateValue(event: Event) {
      // Récupère la nouvelle valeur du champ de formulaire puis met à jour la valeur locale
      const newValue = (event.target as HTMLInputElement).value
      this.localValue = newValue
    },

    /**
     * Gère la perte de focus sur le champ de formulaire.
     *
     * @emits {Object} field - L'objet du champ de formulaire, utilisé pour signaler l'événement de perte de focus
     */
    handleBlur() {
      this.$emit('blur', this.field)
    },
  },
}
</script>
