import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserDetails from '../../src/views/user/UserDetails.vue'
import { useRoute } from 'vue-router'
import { UserStore } from '../../src/stores/UserStore'

// Mock the store
vi.mock('@/stores/UserStore', () => ({
  UserStore: vi.fn().mockReturnValue({
    userData: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active',
    },
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    errorMessage: '',
  }),
}))

// Mock useRoute
vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockReturnValue({
    params: {
      id: '1',
    },
  }),
}))

// Mock the validation functions
vi.mock('@/utils/Validator', () => ({
  validateEmail: vi.fn().mockReturnValue(true),
  validateRole: vi.fn().mockReturnValue(true),
}))

describe('UserDetails.vue', () => {
  it('should render the user details form', async () => {
    const wrapper = mount(UserDetails)
    expect(wrapper.find('h1').text()).toBe('User Details')
    expect(
      (wrapper.find('input[placeholder="Enter first name"]').element as HTMLInputElement).value,
    ).toBe('John')
    expect(
      (wrapper.find('input[placeholder="Enter last name"]').element as HTMLInputElement).value,
    ).toBe('Doe')
    expect(
      (wrapper.find('input[placeholder="Enter email"]').element as HTMLInputElement).value,
    ).toBe('john.doe@example.com')
    expect(wrapper.find('select').element.value).toBe('user')
  })

  it('should navigate back to home when goBack is called', async () => {
    const mockPush = vi.fn()
    const wrapper = mount(UserDetails, {
      global: {
        mocks: {
          $router: { push: mockPush },
        },
      },
    })

    await wrapper.find('button.cancel').trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/home')
  })
})
