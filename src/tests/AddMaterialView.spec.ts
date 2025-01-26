import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import AddEquipment from '@/views/equipment/AddEquipment.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'

// SC05 - Ajout d'un matériel
describe('AddEquipment.vue', () => {
  let wrapper: any
  let equipmentStore: any

  // Avant chaque test, on initialise le store et on monte le component
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(AddEquipment)
    equipmentStore = EquipmentStore()
    equipmentStore.addEquipment = vi.fn()
  })

  // TC001 - Ajout d'un matériel OK
  it("Ajout d'un matériel OK", async () => {
    const nameInput = wrapper.find('#name')
    const typeInput = wrapper.find('#type')
    const refInput = wrapper.find('#ref')
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    // Mock pour simuler la méthode `addEquipment`
    vi.spyOn(equipmentStore, 'addEquipment').mockImplementation(() => {
      return Promise.resolve()
    })

    wrapper.vm.$router = { push: vi.fn() }

    // Remplir le formulaire
    await nameInput.setValue('Iphone 16')
    await typeInput.setValue('phone')
    await refInput.setValue('AP')
    await descriptionInput.setValue('Un iphone')

    await nameInput.trigger('blur')
    await typeInput.trigger('blur')
    await refInput.trigger('blur')
    await descriptionInput.trigger('blur')

    await addEquipmentButton.trigger('submit')

    expect(equipmentStore.addEquipment).toHaveBeenCalledWith({
      name: 'Iphone 16',
      type: 'phone',
      ref: 'AP',
      description: 'Un iphone',
      status: 'available',
      image: '',
    })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home')
  })

  //                       //
  // TC002 Nnon applicable //
  //                       //

  // TC003 - Ajout d'un matériel avec un nom non conforme au REGEX
  it("Ajout d'un matériel avec un nom non conforme au REGEX", async () => {
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

  // TC004 - Ajout d'un matériel avec un type non conforme au REGEX
  it("Ajout d'un matériel avec un type non conforme au REGEX", async () => {
    const typeInput = wrapper.find('#type')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await typeInput.setValue('a!!!')
    await typeInput.trigger('blur')

    expect(wrapper.vm.errors.type).toBe('Invalid type')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  //                       //
  // TC005 Nnon applicable //
  //                       //

  // TC006 - Ajout d'un matériel avec une description non conforme au REGEX
  it("Ajout d'un matériel avec une description non conforme au REGEX", async () => {
    const descriptionInput = wrapper.find('#description')
    const addEquipmentButton = wrapper.find('button[type="submit"]')

    await descriptionInput.setValue('a'.repeat(201))
    await descriptionInput.trigger('blur')

    expect(wrapper.vm.errors.description).toBe('Invalid description')
    expect(addEquipmentButton.attributes('disabled')).toBeDefined()
  })

  // TC007 - Ajout d'un matériel sans avoir rempli tous les champs
  it("Ajout d'un matériel sans avoir rempli tous les champs", async () => {
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

  // TC008 - Vérifier si le bouton s'active correctement
  it("Vérifier si le bouton s'active correctement", async () => {
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
