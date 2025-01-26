import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthStore } from '@/stores/AuthStore'
import { createPinia, setActivePinia } from 'pinia'
import UserInfo from '@/views/user/UserInfo.vue'

describe('UserManagment.vue', () => {
  let wrapperUserInfo: any
  let authStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = AuthStore()
    wrapperUserInfo = mount(UserInfo, {
      props: {
        userInfo: {
          id: 'ANXX123',
          lastName: 'Doe',
          firstName: 'John',
          email: 'john.doe@gmail.com',
          role: 'user',
        },
      },
      global: {
        stubs: {
          UserInfo: true,
        },
      },
    })
  })

  //TCOO1
  it('Consultation de ses propres informations personnelles', () => {
    console.log(wrapperUserInfo.text())
    expect(wrapperUserInfo.text()).toContain('Last name: Doe')
    expect(wrapperUserInfo.text()).toContain('First name: John')
    expect(wrapperUserInfo.text()).toContain('Mail: john.doe@gmail.com')
    expect(wrapperUserInfo.text()).toContain('Role: user')
  })
})
