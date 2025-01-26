import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BorrowEquipment from '@/views/equipment/BorrowEquipment.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { RegisterStore } from '@/stores/RegisterStore'
import { AuthStore } from '@/stores/AuthStore'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { BorrowStore } from '@/stores/BorrowStore'

// Converti une date au format JJ-MM-AAAA
const formatDate = (date: string): string => {
  const [year, month, day] = date.split('-')
  return `${day}-${month}-${year}`
}

describe('BorrowEquipment.vue', () => {
  let wrapperDetails: any
  let equipmentStore: any
  let registerStore: any
  let authStore: any
  let borrowStore: any

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/borrow/:id', name: 'BorrowEquipment', component: BorrowEquipment }],
  })

  beforeEach(async () => {
    // Initialisation de Pinia
    setActivePinia(createPinia())

    // Initialisation des stores
    registerStore = RegisterStore()
    equipmentStore = EquipmentStore()
    authStore = AuthStore()

    // Enregistre un utilisateur fictif via register
    await authStore.login('johndoe3@example.com', 'password123')
    await registerStore.register('Doe', 'John', 'admin', 'johndoe3@example.com', 'password123')

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

  it('Emprunt sans avoir rempli tous les champs', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    await startDateInput.setValue('')
    await endDateInput.setValue('')

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Please provide both start and end dates.')
  })

  it('Emprunt avec dates (début ou fin) dépassant 1 an.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (2 ans après aujourd'hui) et la date de fin (plus d'un an après)
    const today = new Date()
    const startDate = new Date(today.setFullYear(today.getFullYear() + 2)).toLocaleDateString(
      'fr-CA',
    ) // 2 ans après aujourd'hui
    const endDate = new Date(today.setDate(today.getDate() + 5)).toLocaleDateString('fr-CA') // 5 jours après la date de début

    await startDateInput.setValue(startDate)
    await endDateInput.setValue(endDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith(
      'The start date must not exceed 1 year from the current date.',
    )
  })

  it('Emprunt avec la date de fin avant la date de début.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (aujourd'hui) et la date de fin (avant la date de début)
    const today = new Date()
    const startDate = today.toLocaleDateString('fr-CA') // Aujourd'hui
    const endDate = new Date(today.setDate(today.getDate() - 3)).toLocaleDateString('fr-CA') // 3 jours avant aujourd'hui, donc avant la date de début

    await startDateInput.setValue(startDate)
    await endDateInput.setValue(endDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('The end date must be after the start date.')
  })

  it('Emprunt avec au moins une date déjà passée.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (10 jours avant aujourd'hui) et la date de fin (7 jours après la date de début)
    const today = new Date()
    const startDate = new Date(today.setDate(today.getDate() - 10)).toLocaleDateString('fr-CA') // 10 jours avant aujourd'hui (date déjà passée)
    const endDate = new Date(today.setDate(today.getDate() + 17)).toLocaleDateString('fr-CA') // 7 jours après la date de début

    await startDateInput.setValue(startDate)
    await endDateInput.setValue(endDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('The start date cannot be in the past.')
  })

  it('Emprunt de plus de 6 mois.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (aujourd'hui) et la date de fin (plus de 6 mois après)
    const today = new Date()
    const startDate = today.toLocaleDateString('fr-CA') // Aujourd'hui
    const endDate = new Date(today.setMonth(today.getMonth() + 7)).toLocaleDateString('fr-CA') // 7 mois après aujourd'hui

    await startDateInput.setValue(startDate)
    await endDateInput.setValue(endDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('The borrowing period must not exceed 6 months.')
  })

  it('Emprunt OK.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (aujourd'hui) et la date de fin (15 jours après)
    const today = new Date()
    const startDate = today.toLocaleDateString('fr-CA') // Aujourd'hui
    const endDate = new Date(today.setDate(today.getDate() + 14)).toLocaleDateString('fr-CA') // 15 jours après aujourd'hui

    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)

    await startDateInput.setValue(formattedStartDate)
    await endDateInput.setValue(formattedEndDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Equipment borrowed successfully!')
  })

  // Le test passe mais le message d'erreur n'est pas le bon
  it('Emprunt sur un matériel déjà emprunté sur la période souhaitée.', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    borrowStore = BorrowStore()

    borrowStore.borrow = [
      {
        id: 1,
        equipment: {
          id: 'abdsss64578',
          name: 'Iphone 16',
          type: 'phone',
          ref: 'AP-4689',
          description: 'in good condition',
          status: 'available',
          image: 'phone.png',
        },
        borrowDate: Date.now() + 1000 * 60 * 60 * 24 * 10, // Dans 10 jours
        returnDate: Date.now() + 1000 * 60 * 60 * 24 * 15, // Dans 15 jours
      },
    ]

    const startDateInput = wrapperDetails.find('#start-date')
    const endDateInput = wrapperDetails.find('#end-date')
    const borrowButton = wrapperDetails.find('#borrow-button')

    // Calcule la date de début (10 jours après aujourd'hui) et la date de fin (5 jours après)
    const today = new Date()
    const startDate = new Date(today.setDate(today.getDate() + 10)).toLocaleDateString('fr-CA') // 10 jours après aujourd'hui
    const endDate = new Date(today.setDate(today.getDate() + 5)).toLocaleDateString('fr-CA') // 5 jours après la date de début

    await startDateInput.setValue(startDate)
    await endDateInput.setValue(endDate)

    await startDateInput.trigger('blur')
    await endDateInput.trigger('blur')

    await borrowButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Equipment is already on loan during this period.')
  })
})
