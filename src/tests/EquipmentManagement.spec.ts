import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import EquipmentManagement from '@/views/equipment/EquipmentManagement.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'

// SC09 - Suppression/Désactivation d'un matériel
describe('EquipmentManagement.vue', () => {
  let wrapper: any
  let equipmentStore: any

  // Avant chaque test, on initialise le store et le wrapper
  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(EquipmentManagement)
    equipmentStore = EquipmentStore()
  })

  // TC001
  it("Suppression d'un matériel OK", async () => {
    const equipmentId = '1234'
    equipmentStore.equipment = [{ id: equipmentId }]

    // Simuler l'action de suppression
    await equipmentStore.deleteEquipment(equipmentId)
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)).toBeUndefined()
  })

  //                                        //
  // VOIR EquipmentStore.spec.ts POUR TC002 //
  //                                        //

  //                                        //
  // VOIR EquipmentStore.spec.ts POUR TC003 //
  //                                        //

  //                                        //
  // VOIR EquipmentStore.spec.ts POUR TC004 //
  //                                        //

  //                                        //
  // VOIR EquipmentStore.spec.ts POUR TC005 //
  //                                        //
})
