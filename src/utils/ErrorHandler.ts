import { FirebaseError } from 'firebase/app'

/**
 * Gère les erreurs Firebase et les messages d'erreur associés.
 *
 * @param {unknown} error - Erreur à gérer.
 * @param {Ref<string>} errorMessage - Référence à la variable qui stockera le message d'erreur.
 */
export const handleFirebaseError = (error: unknown, errorMessage: { value: string }) => {
  // Gère les erreurs Firebase spécifiques à Firebase
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'not-found':
        errorMessage.value = 'Equipment not found.'
        break
      case 'unavailable':
        errorMessage.value = 'Service temporarily unavailable, please try again later.'
        break
      case 'timeout':
        errorMessage.value = 'No connection, please check your network.'
        break
      case 'permission-denied':
        errorMessage.value = 'You do not have permission to perform this action.'
        break
      default:
        errorMessage.value = 'Internal error, please try again later.'
    }
  } else {
    // Gère les erreurs inconnues
    errorMessage.value = 'Unknown error, please try again later.'
  }
}
