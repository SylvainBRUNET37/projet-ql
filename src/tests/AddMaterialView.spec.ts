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

    expect(wrapper.vm.errors.name).toBe('Name is required')
    expect(wrapper.vm.errors.type).toBe('Type is required')
    expect(wrapper.vm.errors.ref).toBe('Reference is required')
    expect(wrapper.vm.errors.description).toBe('Description is required')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  it('Ajout d un matériel avec une référence déjà existante.', async () => {
    authStore.addMaterial.mockRejectedValueOnce({
      message: 'The reference already corresponds to a material',
    })

    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Material Name')
    await typeInput.setValue('Type')
    await refInput.setValue('EXISTING_REF')
    await descriptionInput.setValue('Description')

    await addEquipmentButton.trigger('click')

    expect(wrapper.vm.errorMessage).toBe('The reference already corresponds to a material')
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

  it('Ajout d un matériel avec des champs valides.', async () => {
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Valid Name')
    await typeInput.setValue('Valid Type')
    await refInput.setValue('VALID_REF')
    await descriptionInput.setValue('Valid description.')

    await addEquipmentButton.trigger('click')

    expect(authStore.addMaterial).toHaveBeenCalledWith({
      name: 'Valid Name',
      type: 'Valid Type',
      ref: 'VALID_REF',
      description: 'Valid description.',
    })
    expect(wrapper.vm.successMessage).toBe('Material successfully added')
  })

  it('Modification d un matériel OK.', async () => {
    const material = {
      id: 1,
      name: 'Old Name',
      ref: 'OLD_REF',
      type: 'Old Type',
      description: 'Old Description',
    }
    authStore.material = material

    await wrapper.setProps({ material })
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const saveButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Updated Name')
    await typeInput.setValue('Updated Type')
    await refInput.setValue('UPDATED_REF')
    await descriptionInput.setValue('Updated Description')
    await saveButton.trigger('click')

    expect(authStore.updateMaterial).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Name',
      ref: 'UPDATED_REF',
      type: 'Updated Type',
      description: 'Updated Description',
    })
    expect(wrapper.vm.successMessage).toBe('Successful changes')
  })

  it('Suppression d un matériel OK.', async () => {
    const material = {
      id: 1,
      name: 'Material to Delete',
      ref: 'DEL_REF',
      type: 'Type',
      description: 'Description',
    }
    authStore.material = material

    const deleteButton = wrapper.find('button[type="delete"]')
    await deleteButton.trigger('click')

    expect(authStore.deleteMaterial).toHaveBeenCalledWith(material.id)
    expect(wrapper.vm.successMessage).toBe('Material removed from user borrowing catalog')
  })

  it('Suppression d un matériel emprunté.', async () => {
    authStore.deleteMaterial.mockRejectedValueOnce({
      message: 'Already borrowed by user until [date]',
    })

    const material = {
      id: 1,
      name: 'Borrowed Material',
      ref: 'BORROW_REF',
      type: 'Type',
      description: 'Description',
    }
    authStore.material = material

    const deleteButton = wrapper.find('button[type="delete"]')
    await deleteButton.trigger('click')

    expect(wrapper.vm.errorMessage).toBe('Already borrowed by user until [date]')
  })
})
