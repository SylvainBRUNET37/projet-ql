<template>
    <div class="form-container">
      <h1>User Details</h1>
      <form @submit.prevent="saveChanges" class="user-form">
        <div class="form-group">
          <label>First Name:</label>
          <input v-model="user.firstName" />
        </div>
        <div class="form-group">
          <label>Last Name:</label>
          <input v-model="user.lastName" />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="user.email" />
        </div>
        <div class="form-group">
          <label>Role:</label>
          <input v-model="user.role" />
        </div>
        <div class="form-group">
          <label>Status:</label>
          <input v-model="user.status" />
        </div>
        <div class="form-actions">
          <button type="submit" class="button save">Save</button>
          <button type="button" class="button cancel" @click="goBack">Back</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  export default {
    data() {
      return {
        user: null, // Contient les informations de l'utilisateur
      };
    },
    async created() {
      // Récupération de l'ID depuis l'URL
      const userId = this.$route.params.id;
  
      // Chargement des données depuis Firestore
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        this.user = { id: docSnap.id, ...docSnap.data() };
      } else {
        alert('User not found!');
        this.goBack();
      }
    },
    methods: {
      async saveChanges() {
        try {
          const docRef = doc(db, 'users', this.user.id);
          await updateDoc(docRef, this.user); // Sauvegarde des données dans Firestore
          alert('Changes saved successfully!');
          this.goBack();
        } catch (error) {
          console.error('Error while saving changes:', error);
          alert('Unable to save changes.');
        }
      },
      goBack() {
        this.$router.push('/home'); // Retourne à la page User Management
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles similaires à ceux du formulaire pour les équipements */
  .form-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-container h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .form-group input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .button.save {
    background-color: #007bff;
    color: white;
  }
  
  .button.save:hover {
    background-color: #0056b3;
  }
  
  .button.cancel {
    background-color: #f44336;
    color: white;
  }
  
  .button.cancel:hover {
    background-color: #d32f2f;
  }
  </style>
  