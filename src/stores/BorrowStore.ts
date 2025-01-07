/**
 * @file LoanStore.ts
 *
 * Gère la récupération et le suivi des emprunts depuis Firestore.
 */

import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import {
  type DocumentData,
} from 'firebase/firestore';

export const BorrowStore = defineStore('loan', () => {
  // Références réactives
  const borrow: Ref<DocumentData[]> = ref([]);
  const errorMessage: Ref<string> = ref('');

  return {
    borrow,
    errorMessage,
  };
});
