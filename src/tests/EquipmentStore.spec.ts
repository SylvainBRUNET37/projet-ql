import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia } from 'pinia'
import { EquipmentStore } from '@/stores/EquipmentStore'
import * as firebaseFirestore from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { createApp } from 'vue'

// Mock de firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    collection: vi.fn(),
  }
})

// SC09 - Suppression/Désactivation d'un matériel
describe('EquipmentStore.ts', () => {
  let equipmentStore: ReturnType<typeof EquipmentStore>

  // Initialisation avant chaque test
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    equipmentStore = EquipmentStore()
    vi.clearAllMocks()
  })

  // TC002 - Suppression d'un matériel emprunté
  it("Suppression d'un matériel emprunté", async () => {
    // Simule que l'équipement est emprunté
    ;(firebaseFirestore.getDocs as vi.Mock).mockResolvedValueOnce({
      docs: [{ data: () => ({ returnDate: Date.now() + 100000 }) }],
    })

    // Mock de la confirmation
    const confirmationMock = vi.fn().mockReturnValue(false)
    global.confirm = confirmationMock

    // Appelle la méthode pour essayer de supprimer le matériel
    await equipmentStore.deleteEquipment('equipment-id')

    // Vérifie que la confirmation est demandée et que le message d'erreur est vide
    expect(confirmationMock).toHaveBeenCalled()
    expect(equipmentStore.errorMessage).toBe('')
  })

  // TC003 - Désactivation d'un matériel OK
  it("Désactivation d'un matériel OK", async () => {
    // Simule que l'équipement n'est pas emprunté
    ;(firebaseFirestore.getDocs as vi.Mock).mockResolvedValueOnce({
      docs: [],
    })

    const updateMock = vi.fn().mockResolvedValueOnce(undefined)
    ;(firebaseFirestore.updateDoc as vi.Mock).mockImplementation(updateMock)

    // Appelle la méthode pour désactiver le matériel
    await equipmentStore.updateEquipmentStatus('equipment-id', 'available')

    // Vérifie que la méthode updateDoc est appelée et que le message d'erreur est vide
    expect(updateMock).toHaveBeenCalled()
    expect(equipmentStore.errorMessage).toBe('')
  })

  // TC005 - Désactivation d'un matériel emprunté
  it("Désactivation d'un matériel emprunté", async () => {
    // Simule que l'équipement est emprunté avec une date de retour dans le futur
    ;(firebaseFirestore.getDocs as vi.Mock).mockResolvedValueOnce({
      docs: [{ data: () => ({ returnDate: Date.now() + 100000 }) }],
    })

    // Mock de l'alerte
    const alertMock = vi.fn()
    global.alert = alertMock

    // Appelle la méthode pour essayer de désactiver le matériel
    await equipmentStore.updateEquipmentStatus('equipment-id', 'available')

    // Vérifie que l'alerte est affichée et que le message d'erreur est vide
    expect(alertMock).toHaveBeenCalledWith('Equipment is already borrowed by a user')
    expect(equipmentStore.errorMessage).toBe('')
  })

  // TC004 - Activation d'un matériel OK
  it("Activation d'un matériel OK", async () => {
    // Simule que l'équipement n'est pas emprunté
    ;(firebaseFirestore.getDocs as vi.Mock).mockResolvedValueOnce({
      docs: [],
    })

    // Mock de la méthode updateDoc
    const updateMock = vi.fn().mockResolvedValueOnce(undefined)
    ;(firebaseFirestore.updateDoc as vi.Mock).mockImplementation(updateMock)

    // Appelle la méthode pour activer le matériel
    await equipmentStore.updateEquipmentStatus('equipment-id', 'unavailable')

    // Vérifie que la méthode updateDoc est appelée et que le message d'erreur est vide
    expect(updateMock).toHaveBeenCalled()
    expect(equipmentStore.errorMessage).toBe('')
  })
})
