import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import AuthFormView from '@/views/AuthFormView.vue'
import { AuthStore } from '@/stores/AuthStore'
import { createPinia, setActivePinia } from 'pinia'
import type { DocumentData } from 'firebase/firestore'
import type { Router as VueRouter } from 'vue-router'

//Fichier qui est concerné par le test
describe('AuthFormView.vue', () => {
  //wrapper représente le component testé, authStore le système d'authentification
  let wrapper: VueWrapper<InstanceType<typeof AuthFormView>>
  let authStore: ReturnType<typeof AuthStore>

  //Avant chaque test, on initialise wrapper et authStore, Pinia est obligatoire pour bien initialiser les stores
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(AuthFormView)
    authStore = AuthStore()
  })

  //it est le cas que l'on veut tester
  it('Le formulaire existe.', () => {
    //On trouve les différentes parties de notre component (ici les 2 champs et le bouton) et on les associe à une constante
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    //Ce qu'il y a dans expect représente ce qu'on s'attend à voir après avoir fait le test
    //Si c'est bon, le test est réussi sinon erreur
    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
  })

  //Tous les tests qui utilisent le mot clé await doivent être async !
  it('Un ou plusieurs champs ne sont pas remplis.', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    //await permet d'attendre qu'une opération soit terminée avant de continuer le code
    //on peut donner des valeurs aux champs avec setValue
    await emailInput.setValue('')
    await passwordInput.setValue('')

    //trigger simule un évènement, blur permet de valider un champ
    await emailInput.trigger('blur')
    await passwordInput.trigger('blur')

    //on regarde si le bouton est bien désactivé
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Le mail n'est pas valide.", async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const submitButton = wrapper.find('button[type="submit"]')

    //mail sans @ ni .
    await emailInput.setValue('invalidemail')
    await emailInput.trigger('blur')

    //on regarde si le message d'erreur est bien mis et au bon endroit puis si le bouton est désactivé
    expect(wrapper.vm.errors.email).toBe('Invalid email')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Le mot de passe n'est pas valide.", async () => {
    //pareil pour mdp trop court (< 6 caractères)
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    await passwordInput.setValue('12345')
    await passwordInput.trigger('blur')

    expect(wrapper.vm.errors.password).toBe('Invalid password')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it("Le bouton s'active quand les champs sont remplis correctement.", async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    await emailInput.setValue('emailvalide@gmail.com')
    await emailInput.trigger('blur')

    await passwordInput.setValue('123456')
    await passwordInput.trigger('blur')

    //L'état disabled du bouton ne doit pas être défini
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('Les informations sont conformes mais ne correspondent pas à un utilisateur existant.', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    // On va mocker le système d'authentification
    vi.spyOn(authStore, 'login').mockImplementation(() => {
      // Simule une BDD vide en lançant une erreur
      return Promise.reject(new Error("User doesn't exist"))
    })

    // Simule un router
    wrapper.vm.$router = {
      push: vi.fn(),
      currentRoute: {},
      options: {},
      listening: false,
      addRoute: vi.fn(),
    } as unknown as VueRouter

    // On met les informations et on trigger l'événement submit du bouton
    await emailInput.setValue('emailvalide@gmail.com')
    await emailInput.trigger('blur')

    await passwordInput.setValue('123456')
    await passwordInput.trigger('blur')

    await submitButton.trigger('submit')

    // Le système d'authentification doit être appelé et il doit y avoir une erreur
    expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456')
    expect(wrapper.vm.errorMessage).toBe('An error occurred during login. Please try again.')
    expect(wrapper.vm.$router.push).not.toHaveBeenCalledWith('/home') // Pas de changement de route vers /home détecté
  })

  it('Login OK', async () => {
    //Même chose que le test d'avant mais on a un user existant dans la bdd
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const submitButton = wrapper.find('button[type="submit"]')

    vi.spyOn(authStore, 'login').mockImplementation(() => {
      const users: DocumentData[] = [{ email: 'emailvalide@gmail.com', password: '123456' }]
      const user = users.find(
        (user) => user.email === 'emailvalide@gmail.com' && user.password === '123456',
      )

      authStore.userData = user ?? null

      return Promise.resolve()
    })

    // Simule un router
    wrapper.vm.$router = {
      push: vi.fn(),
      currentRoute: {},
      options: {},
      listening: false,
      addRoute: vi.fn(),
    } as unknown as VueRouter

    await emailInput.setValue('emailvalide@gmail.com')
    await emailInput.trigger('blur')

    await passwordInput.setValue('123456')
    await passwordInput.trigger('blur')

    await submitButton.trigger('submit')

    expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456')
    expect(wrapper.vm.errorMessage).toBe('') //Pas de message d'erreur
    expect(authStore.userData).toEqual({ email: 'emailvalide@gmail.com', password: '123456' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home') // On est bien redirigé vers /home
  })
})
