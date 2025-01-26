import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { CallableRequest } from 'firebase-functions/v2/https'

// Initialisation de l'application Firebase Admin
admin.initializeApp()

export const deleteUser = functions.https.onCall(async (request: CallableRequest) => {
  const { userId } = request.data as { userId: string }

  // Vérification que le contexte contient un utilisateur authentifié et un rôle admin
  if (!request.auth?.token?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Unauthorized request.')
  }

  try {
    // Suppression de l'utilisateur dans Firebase Authentication
    await admin.auth().deleteUser(userId)
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      throw new functions.https.HttpsError('internal', error.message)
    } else {
      throw new functions.https.HttpsError('internal', 'Unknown error')
    }
  }
})
