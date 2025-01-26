import { AuthStore } from '@/stores/AuthStore'
import { setActivePinia, createPinia } from 'pinia'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'

// Mock de Firebase
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
}))

describe('AuthStore - Jest', () => {
  let store: ReturnType<typeof AuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = AuthStore()
  })

  it('doit connecter un utilisateur avec succès', async () => {
    const mockUser = { uid: '123' }
    const mockUserDoc = { exists: () => true, data: () => ({ status: 'active' }) }

    ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser })
    ;(getDoc as jest.Mock).mockResolvedValueOnce(mockUserDoc)

    await store.login('test@example.com', 'password')

    expect(store.user).toEqual(mockUser)
    expect(store.userData).toEqual({ status: 'active' })
    expect(store.errorMessage).toBe('')
  })
})
