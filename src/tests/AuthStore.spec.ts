import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia } from 'pinia'
import { AuthStore } from '@/stores/AuthStore'
import { FirebaseError } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { createApp } from 'vue'

// Mock de firebase/auth
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    signInWithEmailAndPassword: vi.fn(),
  }
})

// SC10 - Communication avec firebase
describe('AuthStore.ts', () => {
  let authStore: ReturnType<typeof AuthStore>

  // Initialisation avant chaque test
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    authStore = AuthStore()
  })

  // TC001 - Serveur inaccessible ou indisponible
  it('No connection, please check your network', async () => {
    // Simule une erreur de timeout
    ;(firebaseAuth.signInWithEmailAndPassword as vi.Mock).mockRejectedValueOnce(
      new FirebaseError('auth/timeout', 'No connection, please check your network'),
    )

    // Appel la méthode de login et vérifie le message d'erreur
    await authStore.login('email@example.com', 'password')
    expect(authStore.errorMessage).toBe('No connection, please check your network.')
  })

  // TC002 - Temps de réponse trop long du serveur
  it('Temps de réponse trop long du serveur', async () => {
    // Simuler une erreur de réseau
    ;(firebaseAuth.signInWithEmailAndPassword as vi.Mock).mockRejectedValueOnce(
      new FirebaseError('auth/network-request-failed', 'Network request failed'),
    )

    // Appel la méthode de login et vérifie le message d'erreur
    await authStore.login('email@example.com', 'password')
    expect(authStore.errorMessage).toBe('Service temporarily unavailable, please try again later.')
  })

  // TC003 - Erreur interne
  it('Erreur interne', async () => {
    // Simule une erreur interne générique
    ;(firebaseAuth.signInWithEmailAndPassword as vi.Mock).mockRejectedValueOnce(
      new Error('Internal server error'),
    )

    // Appel la méthode de login et vérifie le message d'erreur
    await authStore.login('email@example.com', 'password')
    expect(authStore.errorMessage).toBe('Internal error, please try again later.')
  })
})
