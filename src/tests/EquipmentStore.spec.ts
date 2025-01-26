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
  })

  // TC009 - Suppression d'un matériel emprunté
  it("Suppression d'un matériel emprunté", async () => {
    // Simule que l'équipement est emprunté
    ;(firebaseFirestore.getDocs as vi.Mock).mockResolvedValueOnce({
      docs: [{ data: () => ({ returnDate: Date.now() + 100000 }) }],
    })

    const confirmationMock = vi.fn().mockReturnValue(false)
    global.confirm = confirmationMock

    await equipmentStore.deleteEquipment('equipment-id')
    expect(confirmationMock).toHaveBeenCalled()
    expect(equipmentStore.errorMessage).toBe('')
  })
})
