import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterFormView from '@/views/RegisterFormView.vue'
import { RegisterStore } from '@/stores/RegisterStore'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

describe('RegisterFormView.vue', () => {
  let wrapper: any
  let registerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(RegisterFormView)
    registerStore = RegisterStore()
  })

  it('Le formulaire existe.', () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    expect(firstNameInput.exists()).toBe(true)
    expect(lastNameInput.exists()).toBe(true)
    expect(emailInput.exists()).toBe(true)
    expect(roleInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
    expect(confirmPasswordInput.exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
  })

  it("Création d'utilisateur sans avoir rempli tous les champs.", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    await firstNameInput.setValue('')
    await lastNameInput.setValue('')
    await emailInput.setValue('')
    await roleInput.setValue('')
    await passwordInput.setValue('')
    await confirmPasswordInput.setValue('')

    await firstNameInput.trigger('blur')
    await lastNameInput.trigger('blur')
    await emailInput.trigger('blur')
    await roleInput.trigger('blur')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.trigger('blur')

    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Création d'utilisateur avec un nom/prénom non conforme au REGEX.", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const submitButton = wrapper.find('button[type="submit"]')

    await firstNameInput.setValue('a!')
    await lastNameInput.setValue('b!')

    await firstNameInput.trigger('blur')
    await lastNameInput.trigger('blur')

    expect(wrapper.vm.errors.firstName).toBe('Invalid firstname')
    expect(wrapper.vm.errors.lastName).toBe('Invalid lastname')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Création d'utilisateur avec un mail non conforme au REGEX.", async () => {
    const emailInput = wrapper.find('#email')
    const submitButton = wrapper.find('button[type="submit"]')

    await emailInput.setValue('invalidemail')

    await emailInput.trigger('blur')

    expect(wrapper.vm.errors.email).toBe('Invalid email')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Création d'utilisateur avec un mot de passe non conforme au REGEX.", async () => {
    const passwordInput = wrapper.find('#password')
    const submitButton = wrapper.find('button[type="submit"]')

    await passwordInput.setValue('12345')

    await passwordInput.trigger('blur')

    expect(wrapper.vm.errors.password).toBe('Password must be between 6 and 20 characters')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Création d'utilisateur avec une confirmation de mot de passe ne correspondant pas au mot de passe.", async () => {
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    await passwordInput.setValue('123456')
    await confirmPasswordInput.setValue('1234567')

    await passwordInput.trigger('blur')
    await confirmPasswordInput.trigger('blur')

    expect(wrapper.vm.errors.confirmPassword).toBe('Passwords do not match')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Vérifier si le bouton s'active correctement.", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    await firstNameInput.setValue('John')
    await lastNameInput.setValue('Doe')
    await emailInput.setValue('johndoe@gmail.com')
    await roleInput.setValue('admin')
    await passwordInput.setValue('123456')
    await confirmPasswordInput.setValue('123456')

    await firstNameInput.trigger('blur')
    await lastNameInput.trigger('blur')
    await emailInput.trigger('blur')
    await roleInput.trigger('blur')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.trigger('blur')

    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it("Création d'utilisateur avec un mail correspondant à un utilisateur activé.", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    vi.spyOn(registerStore, 'register').mockImplementation(async () => {
      registerStore.errorMessage = 'Email is already in use.'
      await nextTick()
    })

    wrapper.vm.$router = { push: vi.fn() }

    await firstNameInput.setValue('John')
    await lastNameInput.setValue('Doe')
    await emailInput.setValue('johndoe@gmail.com')
    await roleInput.setValue('user')
    await passwordInput.setValue('123456')
    await confirmPasswordInput.setValue('123456')

    await submitButton.trigger('submit')

    await nextTick()

    expect(registerStore.register).toHaveBeenCalledWith(
      'John',
      'Doe',
      'user',
      'johndoe@gmail.com',
      '123456',
    )

    expect(registerStore.errorMessage).toBe('Email is already in use.') // Vérifie qu'il y a un message d'erreur
    expect(wrapper.vm.$router.push).not.toHaveBeenCalledWith('/home') // Pas de changement de route vers /home détecté
  })

  it("Création d'utilisateur avec un mail correspondant à utilisateur désactivé.", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    // Mock pour simuler la vérification des méthodes de register
    const registerMock = vi.spyOn(registerStore, 'register').mockImplementation(async () => {
      registerStore.errorMessage = 'The account has been reactivated.'
      await nextTick()
    })

    wrapper.vm.$router = { push: vi.fn() }

    await firstNameInput.setValue('user')
    await lastNameInput.setValue('inactive')
    await emailInput.setValue('inactive.user@example.com')
    await roleInput.setValue('user')
    await passwordInput.setValue('password')
    await confirmPasswordInput.setValue('password')

    await firstNameInput.trigger('blur')
    await lastNameInput.trigger('blur')
    await emailInput.trigger('blur')
    await roleInput.trigger('blur')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.trigger('blur')

    await submitButton.trigger('submit')

    await nextTick()

    expect(registerStore.register).toHaveBeenCalledWith(
      'user',
      'inactive',
      'user',
      'inactive.user@example.com',
      'password',
    )

    expect(registerStore.errorMessage).toBe('The account has been reactivated.') // Vérifie qu'il y a un message d'erreur
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home') // Vérifie que la route a été changée vers /home
  })

  it("Création d'utilisateur OK", async () => {
    const firstNameInput = wrapper.find('#firstName')
    const lastNameInput = wrapper.find('#lastName')
    const emailInput = wrapper.find('#email')
    const roleInput = wrapper.find('#role')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    const submitButton = wrapper.find('button[type="submit"]')

    // Mock pour simuler la vérification des méthodes de register
    const registerMock = vi.spyOn(registerStore, 'register').mockImplementation(() => {
      const users: any[] = []

      registerStore.userData = {
        lastname: 'Doe',
        firstname: 'John',
        role: 'admin',
        email: 'johndoe@gmail.com',
      }

      return Promise.resolve()
    })

    wrapper.vm.$router = { push: vi.fn() }

    await firstNameInput.setValue('John')
    await lastNameInput.setValue('Doe')
    await emailInput.setValue('johndoe@gmail.com')
    await roleInput.setValue('admin')
    await passwordInput.setValue('123456')
    await confirmPasswordInput.setValue('123456')

    await firstNameInput.trigger('blur')
    await lastNameInput.trigger('blur')
    await emailInput.trigger('blur')
    await roleInput.trigger('blur')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.trigger('blur')

    await submitButton.trigger('submit')

    expect(registerStore.register).toHaveBeenCalledWith(
      'John',
      'Doe',
      'admin',
      'johndoe@gmail.com',
      '123456',
    )
    expect(registerStore.userData).toEqual({
      lastname: 'Doe',
      firstname: 'John',
      role: 'admin',
      email: 'johndoe@gmail.com',
    })
    expect(wrapper.vm.errors.email).toBe('')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home')
  })
})
