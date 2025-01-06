<template>
    <div class="form-container">
      <h1>User Details</h1>
      <form @submit.prevent="saveChanges" class="user-form">
        <div class="form-group">
          <label>First Name:</label>
          <input v-model="user.firstName" class="input-field" placeholder="Enter first name" />
        </div>
        <div class="form-group">
          <label>Last Name:</label>
          <input v-model="user.lastName" class="input-field" placeholder="Enter last name" />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="user.email" class="input-field" placeholder="Enter email" @blur="validateEmailField" />
          <span v-if="emailError" class="error">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label>Role:</label>
          <select v-model="user.role" class="dropdown">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <span v-if="roleError" class="error">{{ roleError }}</span>
        </div>
        <div class="form-group">
          <label>Status:</label>
          <select v-model="user.status" class="dropdown">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
  import { validateEmail, validateRole } from '@/utils/Validator';
  
  export default {
    data() {
      return {
        user: null, // Contient les informations de l'utilisateur
        emailError: '', // Message d'erreur pour l'email
        roleError: '', // Message d'erreur pour le rôle
      };
    },
    async created() {
      const userId = this.$route.params.id;
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
      validateEmailField() {
        if (!validateEmail(this.user.email)) {
          this.emailError = 'Invalid email format';
        } else {
          this.emailError = '';
        }
      },
      validateRoleField() {
        if (!validateRole(this.user.role)) {
          this.roleError = 'Invalid role. Must be "user" or "admin".';
        } else {
          this.roleError = '';
        }
      },
      async saveChanges() {
        this.validateEmailField();
        this.validateRoleField();
  
        if (this.emailError || this.roleError) {
          alert('Please fix the errors before saving.');
          return;
        }
  
        try {
          const docRef = doc(db, 'users', this.user.id);
          await updateDoc(docRef, this.user);
          alert('Changes saved successfully!');
          this.goBack();
        } catch (error) {
          console.error('Error while saving changes:', error);
          alert('Unable to save changes.');
        }
      },
      goBack() {
        this.$router.push('/home');
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
    background: linear-gradient(to bottom right, #ffffff, #f2f2f2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 28px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
  }
  
  .input-field,
  .dropdown {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background-color: #f9f9f9;
    transition: border-color 0.2s ease-in-out;
  }
  
  .input-field:focus,
  .dropdown:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  .error {
    color: #f44336;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .button.save {
    background-color: #007bff;
    color: #fff;
  }
  
  .button.save:hover {
    background-color: #0056b3;
  }
  
  .button.cancel {
    background-color: #f44336;
    color: #fff;
  }
  
  .button.cancel:hover {
    background-color: #d32f2f;
  }
  </style>
  