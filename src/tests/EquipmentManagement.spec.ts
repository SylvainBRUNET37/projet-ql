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
  it("Suppression d'un matériel OK", async () => {})

  // TC002
  it("Suppression d'un matériel emprunté", async () => {})

  // TC003
  it("Désactivation d'un matériel OK", async () => {})

  // TC004
  it("Activation d'un matériel OK", async () => {})

  // TC005
  it("Désactivation d'un matériel emprunté", async () => {})
})
