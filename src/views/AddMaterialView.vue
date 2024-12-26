<!-- AddMaterialView.vue -->
<!-- Formulaire pour créer un matériel -->

<template>
  <div id="form-container">
    <div class="form">
      <h1 class="form-title">Add Material</h1>

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
        <button type="submit" class="form-submit-button" :disabled="!isFormValid">Add</button>
      </form>
    </div>
  </div>
</template>
