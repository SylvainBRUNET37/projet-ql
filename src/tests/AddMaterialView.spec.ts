import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import AddEquipment from '@/views/equipment/AddEquipment.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'

//Fichier qui est concerné par le test
describe('AddEquipment.vue', () => {
  //wrapper représente le component testé, authStore le système d'authentification
  let wrapper: any
  let authStore: any

  //Avant chaque test, on initialise wrapper et authStore, Pinia est obligatoire pour bien initialiser les stores
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(AddEquipment)
    authStore = EquipmentStore()
  })

  //Tous les tests qui utilisent le mot clé await doivent être async !
  it('Un ou plusieurs champs ne sont pas remplis.', async () => {
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('')
    await typeInput.setValue('')
    await refInput.setValue('')
    await descriptionInput.setValue('')

    await nameInput.trigger('blur')
    await typeInput.trigger('blur')
    await refInput.trigger('blur')
    await descriptionInput.trigger('blur')

    expect(wrapper.vm.errors.name).toBe('Please complete this field')
    expect(wrapper.vm.errors.type).toBe('Please complete this field')
    expect(wrapper.vm.errors.ref).toBe('Please complete this field')
    expect(wrapper.vm.errors.description).toBe('Please complete this field')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  it('Le nom n est pas valide.', async () => {
    const nameInput = wrapper.find('#name')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('a!')
    await nameInput.trigger('blur')

    expect(wrapper.vm.errors.name).toBe('Invalid name')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()

    await nameInput.setValue('a'.repeat(101))
    await nameInput.trigger('blur')

    expect(wrapper.vm.errors.name).toBe('Invalid name')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  it('Le type n est pas valide.', async () => {
    const typeInput = wrapper.find('#type')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await typeInput.setValue('a!!!')
    await typeInput.trigger('blur')

    expect(wrapper.vm.errors.type).toBe('Invalid type')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  it('La description n est pas valide.', async () => {
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await descriptionInput.setValue('a'.repeat(201))
    await descriptionInput.trigger('blur')

    expect(wrapper.vm.errors.description).toBe('Invalid description')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  it('Ajout d un matériel avec des champs valides.', async () => {
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Valid Name')
    await typeInput.setValue('Valid Type')
    await refInput.setValue('IOS')
    await descriptionInput.setValue('Valid description.')

    await addEquipmentButton.trigger('click')

    expect(authStore.addEquipment).toHaveBeenCalledWith({
      name: 'Valid Name',
      type: 'Valid Type',
      ref: 'IOS',
      description: 'Valid description.',
    })
    expect(wrapper.vm.successMessage).toBe('Material successfully added')
  })

  it("Vérifier si le bouton s'active correctement.", async () => {
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Valid Name')
    await typeInput.setValue('Valid Type')
    await refInput.setValue('IOS')
    await descriptionInput.setValue('Valid description.')

    await nameInput.trigger('blur')
    await typeInput.trigger('blur')
    await refInput.trigger('blur')
    await descriptionInput.trigger('blur')

    //L'état disabled du bouton ne doit pas être défini
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })
})
