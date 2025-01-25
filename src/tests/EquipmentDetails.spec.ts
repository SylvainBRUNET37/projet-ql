import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import EquipmentDetails from '@/views/equipment/EquipmentDetails.vue'
import EquipmentResearch from '@/views/equipment/EquipmentResearch.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// Mock routes
const routes = [{ path: '/equipment/:id', name: 'EquipmentDetails', component: EquipmentDetails }]

// Create a mock router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('EquipmentResearch.vue', () => {
  let wrapperResearch: any
  let equipmentStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    equipmentStore = EquipmentStore()
    equipmentStore.equipment = [
      {
        id: 1,
        name: 'Iphone 16',
        type: 'phone',
        ref: 'AP-4686',
        description: 'in good condition',
        status: 'available',
        image: 'phone.png',
      },
    ]
    // Mount the component with the mock router
    wrapperResearch = mount(EquipmentResearch, {
      global: {
        plugins: [router],
      },
    })

    router.push = vi.fn()
  })

  it("Consultation des détails d'un matériel.", async () => {
    // Trouver tous les éléments de carte d'équipement
    const equipmentCards = wrapperResearch.findAll('.card')

    await equipmentCards[0].trigger('click')

    expect(router.push).toHaveBeenCalledWith('/equipment/1')
  })
})

describe('EquipmentDetails.vue', () => {
  let wrapperDetails: any
  let equipmentStore: any

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/equipment/:id', name: 'EquipmentDetails', component: EquipmentDetails }],
  })

  beforeEach(async () => {
    // Initialisation de Pinia
    setActivePinia(createPinia())
    equipmentStore = EquipmentStore()
    equipmentStore.equipment = [
      {
        id: 1,
        name: 'Iphone 16',
        type: 'phone',
        ref: 'AP-4689',
        description: 'in good condition',
        status: 'available',
        image: 'phone.png',
      },
    ]

    await router.push({ name: 'EquipmentDetails', params: { id: '1' } })
    await flushPromises()

    wrapperDetails = mount(EquipmentDetails, {
      global: {
        plugins: [router],
      },
    })

    vi.spyOn(router, 'push').mockResolvedValue()
  })

  it('affiche les input et bouton borrow', async () => {
    const startDateInput = wrapperDetails.find('input[type="date"]')
    expect(startDateInput.exists()).toBe(true)

    const borrowButton = wrapperDetails.find('button[type="submit"]')
    expect(borrowButton.exists()).toBe(true)
  })
})

/*
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
  */
