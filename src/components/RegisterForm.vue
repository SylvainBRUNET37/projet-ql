<!-- RegisterForm.vue -->
<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        lastName: '',
        firstName: '',
        email: '',
        role: '',
        password: '',
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
