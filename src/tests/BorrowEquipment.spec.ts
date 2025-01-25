import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BorrowEquipment from '@/views/equipment/BorrowEquipment.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

describe('BorrowEquipment.vue', () => {
  let wrapperDetails: any
  let equipmentStore: any

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/borrow/:id', name: 'BorrowEquipment', component: BorrowEquipment }],
  })

  beforeEach(async () => {
    // Initialisation de Pinia
    setActivePinia(createPinia())
    equipmentStore = EquipmentStore()
    equipmentStore.equipment = [
      {
        id: 'abdsss64578',
        name: 'Iphone 16',
        type: 'phone',
        ref: 'AP-4689',
        description: 'in good condition',
        status: 'available',
        image: 'phone.png',
      },
    ]

    await router.push({ name: 'BorrowEquipment', params: { id: 'abdsss64578' } })
    await flushPromises()

    wrapperDetails = mount(BorrowEquipment, {
      global: {
        plugins: [router],
      },
    })

    vi.spyOn(router, 'push').mockResolvedValue()
  })

  it('affiche les input et bouton borrow', async () => {
    // Vérifier que les champs de date sont bien rendus
    //const startDateInput = wrapperDetails.find('input[type="date"]')
    //expect(startDateInput.exists()).toBe(true)

    // Vérifier que le bouton "Borrow" existe
    const borrowButton = wrapperDetails.find('button[type="button"]')
    expect(borrowButton.exists()).toBe(true)
  })
})
