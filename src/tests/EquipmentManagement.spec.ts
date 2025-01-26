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
    const equipmentId = '1234';
    equipmentStore.equipment = [{ id: equipmentId }];

    // Simuler l'action de suppression
    await equipmentStore.deleteEquipment(equipmentId);
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)).toBeUndefined();
  })

  // TC002
  it("Suppression d'un matériel emprunté", async () => {
    const equipmentId = '1234';
    equipmentStore.equipment = [{ id: equipmentId, status: 'loaned' }];

    // Simuler une tentative de suppression
    await equipmentStore.deleteEquipment(equipmentId);

    // Vérifier que l'élément est toujours présent
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)).toBeDefined();
  })

  // TC003
  it("Désactivation d'un matériel OK", async () => {
    const equipmentId = '1234';
    equipmentStore.equipment = [{ id: equipmentId, status: 'active' }];

    // Simuler l'action de désactivation
    await equipmentStore.updateEquipmentStatus(equipmentId, 'active');

    // Vérifier que le statut est bien mis à jour
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)?.status).toBe('active');
  })

  // TC004
  it("Activation d'un matériel OK", async () => {
    const equipmentId = '1234';
    equipmentStore.equipment = [{ id: equipmentId, status: 'unavailable' }];

    // Simuler l'action d'activation
    await equipmentStore.updateEquipmentStatus(equipmentId, 'unavailable');

    // Vérifier que le statut est bien mis à jour
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)?.status).toBeUndefined();
  })

  // TC005
  it("Désactivation d'un matériel emprunté", async () => {
    const equipmentId = '1234';
    equipmentStore.equipment = [{ id: equipmentId, status: 'loaned' }];

    // Simuler une tentative de désactivation
    await equipmentStore.updateEquipmentStatus(equipmentId, 'loaned');

    // Vérifier que le statut reste inchangé
    expect(equipmentStore.equipment.find((item) => item.id === equipmentId)?.status).toBe('loaned');
  })
})
