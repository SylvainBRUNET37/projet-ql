import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserInfo from '@/views/user/UserInfo.vue'

describe('UserInfo.vue', () => {
  it("affiche correctement les informations de l'utilisateur", () => {
    const userInfo = {
      id: '1',
      lastName: 'Dupont',
      firstName: 'Jean',
      email: 'jean.dupont@example.com',
      role: 'Admin',
    }

    const wrapper = mount(UserInfo, {
      props: { userInfo },
    })

    // Vérifier que les informations de l'utilisateur sont bien affichées
    expect(wrapper.find('.user-info').exists()).toBe(true)
    expect(wrapper.find('.user-info li:nth-child(1) .value').text()).toBe('Dupont')
    expect(wrapper.find('.user-info li:nth-child(2) .value').text()).toBe('Jean')
    expect(wrapper.find('.user-info li:nth-child(3) .value').text()).toBe('jean.dupont@example.com')
    expect(wrapper.find('.user-info li:nth-child(4) .value').text()).toBe('Admin')
  })
})
