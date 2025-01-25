import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import EquipmentDetails from '@/views/equipment/EquipmentDetails.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// SC008 - Modification d'un matériel
describe('EquipmentDetails.vue', () => {
  let wrapper: any
  let equipmentStore: any

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/equipment/:id', name: 'EquipmentDetails', component: EquipmentDetails }],
  })

  // Avant chaque test, on initialise le store et le wrapper
  beforeEach(async () => {
    setActivePinia(createPinia())
    equipmentStore = EquipmentStore()
    equipmentStore.equipment = [
      {
        id: 'testId9785',
        name: 'Iphone 16',
        type: 'phone',
        ref: 'AP-4689',
        description: 'in good condition',
        status: 'available',
        image: 'phone.png',
      },
    ]

    await router.push({ name: 'EquipmentDetails', params: { id: 'testId9785' } })
    await flushPromises()

    wrapper = mount(EquipmentDetails, {
      global: {
        plugins: [router],
      },
    })

    vi.spyOn(router, 'push').mockResolvedValue()
  })

  // TC001
  it('Modification d un matériel OK', async () => {})
})
