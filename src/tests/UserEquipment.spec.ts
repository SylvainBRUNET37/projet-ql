import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BorrowStore } from '@/stores/BorrowStore'
import { createPinia, setActivePinia } from 'pinia'
import UserEquipment from '@/views/user/UserEquipment.vue'

describe('UserEquipment.vue', async () => {
  let borrowStore: any
  let wrapperUserEquipment: any
  let borrowStoreMock: any

  beforeEach(() => {
    setActivePinia(createPinia())
    borrowStore = BorrowStore()

    // Espionner la méthode après l'initialisation de borrowStore
    borrowStoreMock = vi.spyOn(borrowStore, 'getUserBorrowedEquipments').mockImplementation(() => {
      // Définir des emprunts fictifs pour l'utilisateur
      const mockBorrows = [
        {
          id: '1',
          equipment: { name: 'Laptop', type: 'Electronics', description: 'High-end laptop' },
          borrowDate: Date.now() - 1000 * 60 * 60 * 24, // Hier
          returnDate: Date.now() + 1000 * 60 * 60 * 24 * 5, // Dans 5 jours
        },
        {
          id: '2',
          equipment: { name: 'Projector', type: 'Electronics', description: 'HD projector' },
          borrowDate: Date.now() + 1000 * 60 * 60 * 24 * 2, // Dans 2 jours
          returnDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // Dans 7 jours
        },
      ]

      return Promise.resolve(mockBorrows)
    })

    // Monte le composant après avoir défini le mock
    wrapperUserEquipment = mount(UserEquipment, {
      props: {
        userId: 'ANXX123',
      },
      global: {
        mocks: {
          borrowStore: borrowStore, // Utiliser le bon store ici
        },
      },
    })
  })

  it('charge et trie les emprunts correctement', async () => {
    // Appeler la méthode de chargement des emprunts
    await wrapperUserEquipment.vm.loadUserBorrows()

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifie le contenu des emprunts
    expect(wrapperUserEquipment.vm.currentBorrows[0].equipment.name).toBe('Laptop')
    expect(wrapperUserEquipment.vm.upcomingBorrows[0].equipment.name).toBe('Projector')
  })

  it('gère les erreurs de récupération des emprunts', async () => {
    // Simule une erreur dans la récupération des emprunts
    borrowStoreMock.mockRejectedValueOnce(new Error('Erreur de récupération'))

    // Appeler la méthode
    await wrapperUserEquipment.vm.loadUserBorrows()

    // Attendre que l'exception soit gérée
    await flushPromises()

    // Vérifie que les listes d'emprunts restent vides en cas d'erreur
    expect(wrapperUserEquipment.vm.currentBorrows).toEqual([])
    expect(wrapperUserEquipment.vm.upcomingBorrows).toEqual([])
  })
})
