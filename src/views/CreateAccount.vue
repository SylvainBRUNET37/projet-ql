<template>
  <div class="container">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="lastName">Last Name <span class="required">*</span></label>
        <input
          type="text"
          id="lastName"
          v-model="form.lastName"
          placeholder="Enter last name"
          required
        />
      </div>

      <div class="form-group">
        <label for="firstName">First Name <span class="required">*</span></label>
        <input
          type="text"
          id="firstName"
          v-model="form.firstName"
          placeholder="Enter first name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Enter email address"
          required
        />
      </div>

      <div class="form-group">
        <label for="role">Role <span class="required">*</span></label>
        <input type="text" id="role" v-model="form.role" placeholder="Enter role" required />
      </div>

      <div class="form-group">
        <label for="password">Password <span class="required">*</span></label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Enter password"
          required
        />
      </div>

      <button type="submit" class="btn">Add</button>
    </form>
  </div>
</template>

<script>
import '../assets/styles/authForm.css'

export default {
  name: 'CreateAccount',
  data() {
    return {
      form: {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.form)
      alert('User added successfully!')
    },
  },
}
</script>

<style scoped>
.container {
  width: 300px;
  margin: 50px auto;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.required {
  color: red;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
