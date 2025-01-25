import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import UserManagement from '@/views/user/UserManagment.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'

//Fichier qui est concerné par le test
describe('UserManagement.vue', () => {
  //wrapper représente le component testé, authStore le système d'authentification
  let wrapper: any
  let equipmentStore: any

  //Avant chaque test, on initialise wrapper et authStore, Pinia est obligatoire pour bien initialiser les stores
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(UserManagement)
    equipmentStore = EquipmentStore()
  })

  it('Modification d un matériel OK.', async () => {
    const material = {
      id: 1,
      name: 'Old Name',
      ref: 'Android',
      type: 'Old Type',
      description: 'Old Description',
    }
    equipmentStore.material = material

    await wrapper.setProps({ material })
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const saveButton = wrapper.find('button[type="submit"]')

    await nameInput.setValue('Updated Name')
    await typeInput.setValue('Updated Type')
    await refInput.setValue('IOS')
    await descriptionInput.setValue('Updated Description')
    await saveButton.trigger('click')

    expect(equipmentStore.updateMaterial).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Name',
      ref: 'IOS',
      type: 'Updated Type',
      description: 'Updated Description',
    })
  })

  it('Suppression d un matériel OK.', async () => {
    const material = {
      id: 1,
      name: 'Material to Delete',
      ref: 'DEL_REF',
      type: 'Type',
      description: 'Description',
    }
    equipmentStore.material = material

    const deleteButton = wrapper.find('button[type="delete"]')
    await deleteButton.trigger('click')

    expect(equipmentStore.deleteMaterial).toHaveBeenCalledWith(material.id)
  })

  it('Suppression d un matériel emprunté.', async () => {
    equipmentStore.deleteMaterial.mockRejectedValueOnce({
      message: 'Already borrowed by user',
    })

    const material = {
      id: 1,
      name: 'Borrowed Material',
      ref: 'BORROW_REF',
      type: 'Type',
      description: 'Description',
    }
    equipmentStore.material = material

    const deleteButton = wrapper.find('button[type="delete"]')
    await deleteButton.trigger('click')

    expect(wrapper.vm.errorMessage).toBe('Already borrowed by user')
  })
})
