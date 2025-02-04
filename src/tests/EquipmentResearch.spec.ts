import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import EquipmentResearch from '@/views/equipment/EquipmentResearch.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'

// SC06 - Recherche d'un matériel
describe('EquipmentResearch.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof EquipmentResearch>>
  let equipmentStore: ReturnType<typeof EquipmentStore>

  // Avant chaque test, on initialise le store et le wrapper
  beforeEach(() => {
    setActivePinia(createPinia())
    equipmentStore = EquipmentStore()
    equipmentStore.equipment = [
      { id: 1, name: 'Drill', type: 'Tools', status: 'available', image: 'drill.jpg' },
      { id: 2, name: 'Hammer', type: 'Tools', status: 'unavailable', image: 'hammer.jpg' },
      { id: 3, name: 'Asus Laptop', type: 'Laptop', status: 'available', image: 'laptop.jpg' },
    ]
    wrapper = mount(EquipmentResearch)
  })

  // TC001
  it('Consultation des matériels OK, les matériels disponibles sont affichés', () => {
    // Trouve tous les éléments de carte d'équipement
    const equipmentCards = wrapper.findAll('.card')

    // Vérifie qu'il n'y a que les équipements avec status 'available' dans l'affichage
    expect(equipmentCards).toHaveLength(2) // On sait qu'il y a 2 équipements disponibles

    // Vérifie que la carte d'équipement contient bien "Drill" et "Asus Laptop", mais pas "Hammer"
    expect(equipmentCards[0].text()).toContain('Drill')
    expect(equipmentCards[1].text()).toContain('Asus Laptop')

    // Vérifie qu'il n'y a pas d'équipement "Hammer" dans l'affichage
    expect(equipmentCards[0].text()).not.toContain('Hammer')
    expect(equipmentCards[1].text()).not.toContain('Hammer')
  })

  // TC002
  it("Recherche d'un matériel avec la barre de recherche", async () => {
    // Rempli le champ de recherche et simuler la touche "Entrée"
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Asus Laptop')
    await searchInput.trigger('keyup.enter')

    // Vérifier que seul le bon équipement est affiché
    expect(wrapper.vm.filteredEquipments).toEqual([
      { id: 3, name: 'Asus Laptop', type: 'Laptop', status: 'available', image: 'laptop.jpg' },
    ])

    // Vérifie que la carte de l'équipement est affichée
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards).toHaveLength(1)
    expect(equipmentCards[0].text()).toContain('Asus Laptop')
  })

  // TC003
  it("Recherche d'un matériel avec la barre de recherche mais aucun équipement ne correspond", async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    // Recherche d'un équipement inexistant
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('NonExistentEquipment')
    await searchInput.trigger('keyup.enter')

    // Vérifie que filteredEquipments est vide et que l'alerte a été appelée
    expect(wrapper.vm.filteredEquipments).toEqual([])
    expect(alertMock).toHaveBeenCalledWith('None of the equipment corresponds to the research')
  })

  // TC004
  it("Recherche d'un matériel avec un filtre", async () => {
    const toolsTag = wrapper.find('.tag')
    await toolsTag.trigger('click')

    // Seuls les équipements de type "Tools" doivent être affichés
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards.length).toBe(1)
    expect(equipmentCards[0].text()).toContain('Drill')
  })

  // TC005
  it('Le bouton pour reset les filtres reset bien les filtres', async () => {
    const resetButton = wrapper.find('.filter-container .button')
    await resetButton.trigger('click')

    // Vérifie que les filtres ont été réinitialisés
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards.length).toBe(2)
  })

  // TC006
  it('Les filtres correspondent bien à tous les types des équipement disponibles', () => {
    const tags = wrapper.findAll('.tag')

    // 2 types doivent apparaitre : "Tools" et "Laptop"
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toBe('Tools')
    expect(tags[1].text()).toBe('Laptop')
  })

  // TC007
  it('Les équipements affichés sont seulement ceux disponibles', async () => {
    // Trouve tous les éléments de carte d'équipement
    const equipmentCards = wrapper.findAll('.card')

    // Vérifie qu'il n'y a que les équipements avec status 'available' dans l'affichage
    expect(equipmentCards).toHaveLength(2) // On sait qu'il y a 2 équipements disponibles

    // Vérifie que la carte d'équipement contient bien "Drill" et "Asus Laptop", mais pas "Hammer"
    expect(equipmentCards[0].text()).toContain('Drill')
    expect(equipmentCards[1].text()).toContain('Asus Laptop')

    // Vérifie qu'il n'y a pas d'équipement "Hammer" dans l'affichage
    expect(equipmentCards[0].text()).not.toContain('Hammer')
    expect(equipmentCards[1].text()).not.toContain('Hammer')
  })
})
