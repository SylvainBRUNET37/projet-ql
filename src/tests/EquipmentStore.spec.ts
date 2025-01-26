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

// SC10 - Communication avec firestore & SC09 - Suppression/Désactivation d'un matériel
describe('EquipmentStore.ts', () => {
  let equipmentStore: ReturnType<typeof EquipmentStore>

  // Initialisation avant chaque test
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    equipmentStore = EquipmentStore()
  })

  // SC09 -
  it('should not delete equipment if it is still borrowed', async () => {
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

  // TC003 - Erreur lors de la suppression de l'équipement
  it('should handle error when deleting equipment', async () => {
    // Simule une erreur lors de la suppression
    ;(firebaseFirestore.getDocs as vi.Mock).mockRejectedValueOnce(
      new FirebaseError('not-found', 'Equipment not found.'),
    )

    await equipmentStore.deleteEquipment('equipment-id')
    expect(equipmentStore.errorMessage).toBe('Equipment not found.')
  })
})
