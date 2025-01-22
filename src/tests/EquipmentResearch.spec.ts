import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import EquipmentResearch from '@/components/equipmentResearch/Research.vue'
import { EquipmentStore } from '@/stores/EquipmentStore'
import { createPinia, setActivePinia } from 'pinia'
import { VueWrapper } from '@vue/test-utils'

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
  it('Rend correctement le composant', () => {
    expect(wrapper.exists()).toBe(true)
  })

  // TC002
  it('Recherche les équipements par nom', async () => {
    // Remplir le champ de recherche et simuler la touche "Entrée"
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Asus Laptop')
    await searchInput.trigger('keyup.enter')

    // Vérifier que seul le bon équipement est affiché
    expect(wrapper.vm.filteredEquipments).toEqual([
      { id: 3, name: 'Asus Laptop', type: 'Laptop', status: 'available', image: 'laptop.jpg' },
    ])

    // Vérifier que la carte de l'équipement est affichée
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards).toHaveLength(1)
    expect(equipmentCards[0].text()).toContain('Asus Laptop')
  })

  // TC003
  it("Affiche un message d'alerte si aucun équipement ne correspond à la recherche", async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert

    // Recherche d'un équipement inexistant
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('NonExistentEquipment')
    await searchInput.trigger('keyup.enter')

    // Vérifiez que filteredEquipments est vide et que l'alerte a été appelée
    expect(wrapper.vm.filteredEquipments).toEqual([])
    expect(alertMock).toHaveBeenCalledWith('None of the equipment corresponds to the research')
  })

  // TC004
  it('Filtre les équipements par type lors du clic sur un tag', async () => {
    const toolsTag = wrapper.find('.tag')
    await toolsTag.trigger('click')

    // Seuls les équipements de type "Tools" doivent être affichés
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards.length).toBe(2)
    expect(equipmentCards[0].text()).toContain('Drill')
    expect(equipmentCards[1].text()).toContain('Hammer')
  })

  // TC005
  it('Réinitialise les filtres lors du clic sur le bouton Reset', async () => {
    const resetButton = wrapper.find('.filter-container .button')
    await resetButton.trigger('click')

    // Vérifie que les filtres ont été réinitialisés
    const equipmentCards = wrapper.findAll('.card')
    expect(equipmentCards.length).toBe(3)
  })

  // TC006
  it('Affiche correctement tous les types uniques', () => {
    const tags = wrapper.findAll('.tag')

    // 2 types doivent apparaitre : "Tools" et "Laptop"
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toBe('Tools')
    expect(tags[1].text()).toBe('Laptop')
  })
})
