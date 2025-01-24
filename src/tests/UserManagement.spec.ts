import { mount, flushPromises  } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import  UserManagment  from '../components/management/UserManagment.vue'

import { AuthStore } from '@/stores/AuthStore';
import { BorrowStore } from '@/stores/BorrowStore'
import { createPinia, setActivePinia } from 'pinia';
import type { PropType } from 'vue';
import { userInfo } from 'node:os';
import UserInfo from '@/components/userProfile/UserInfo.vue';
import UserEquipment from '@/components/userProfile/UserEquipment.vue';
import UserDetails from '@/views/user/UserDetails.vue';
import { UserStore } from '@/stores/UserStore';
import { createRouter, createWebHistory } from 'vue-router';
import router from '@/router';

/**
 *                      SCO3 - Consultation d'un compte
 */
describe('UserManagment.vue', () => {

    let wrapperUserInfo: any;
    let authStore: any;
   

    beforeEach(() => {
        setActivePinia(createPinia());
        authStore = AuthStore();
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
          });
    });
    
    //TCOO1
    it("Consultation de ses propres informations personnelles",() => {
        console.log(wrapperUserInfo.text());
        expect(wrapperUserInfo.text()).toContain('Last name: Doe');
        expect(wrapperUserInfo.text()).toContain('First name: John');
        expect(wrapperUserInfo.text()).toContain('Mail: john.doe@gmail.com');
        expect(wrapperUserInfo.text()).toContain('Role: user');
    });
});


describe('UserEquipment.vue', async () => {
    let borrowStore: any;
    let wrapperUserEquipment: any;
    let borrowStoreMock: any;

    beforeEach(() => {
        setActivePinia(createPinia());
        borrowStore = BorrowStore();

        // Espionner la méthode après l'initialisation de borrowStore
        borrowStoreMock = vi.spyOn(borrowStore, 'getUserBorrowedEquipments').mockImplementation((userId: string) => {
            // Définir des emprunts fictifs pour l'utilisateur
            const mockBorrows = [
                {
                    id: '1',
                    equipment: { name: 'Laptop', type: 'Electronics', description: 'High-end laptop' },
                    borrowDate: Date.now() - 1000 * 60 * 60 * 24, // Hier
                    returnDate: Date.now() + 1000 * 60 * 60 * 24 * 5, // Dans 5 jours
                },
                {
                    id: '2',
                    equipment: { name: 'Projector', type: 'Electronics', description: 'HD projector' },
                    borrowDate: Date.now() + 1000 * 60 * 60 * 24 * 2, // Dans 2 jours
                    returnDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // Dans 7 jours
                },
            ];

            return Promise.resolve(mockBorrows);
        });

        // Monte le composant après avoir défini le mock
        wrapperUserEquipment = mount(UserEquipment, {
            props: {
                userId: 'ANXX123',
            },
            global: {
                mocks: {
                    borrowStore: borrowStore, // Utiliser le bon store ici
                },
            },
        });
    });

    it('charge et trie les emprunts correctement', async () => {
        // Appeler la méthode de chargement des emprunts
        await wrapperUserEquipment.vm.loadUserBorrows();

        // Attendre que les promesses soient résolues
        await flushPromises();

        // Vérifie le contenu des emprunts
        expect(wrapperUserEquipment.vm.currentBorrows[0].equipment.name).toBe('Laptop');
        expect(wrapperUserEquipment.vm.upcomingBorrows[0].equipment.name).toBe('Projector');
    });

    it('gère les erreurs de récupération des emprunts', async () => {
        // Simule une erreur dans la récupération des emprunts
        borrowStoreMock.mockRejectedValueOnce(new Error('Erreur de récupération'));

        // Appeler la méthode
        await wrapperUserEquipment.vm.loadUserBorrows();

        // Attendre que l'exception soit gérée
        await flushPromises();

        // Vérifie que les listes d'emprunts restent vides en cas d'erreur
        expect(wrapperUserEquipment.vm.currentBorrows).toEqual([]);
        expect(wrapperUserEquipment.vm.upcomingBorrows).toEqual([]);
    });
});

describe('UserDetails.vue', () => {
    let userDetailsWrapper: any;
    let userStore: any;
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/admin/user/:id', name: 'UserDetails', component: UserDetails },
      ],
    });
  
    beforeEach(() => {
      // Initialisation de Pinia
      setActivePinia(createPinia());
      userStore = UserStore();
  
      // Données utilisateur simulées
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        role: 'user',
      };
  
      // Initialiser le wrapper avec les props et router
      userDetailsWrapper = mount(UserDetails, {
        props: {
          user, // Injection directe des props utilisateur
        },
        global: {
          plugins: [router],
        },
      });
    });
  
    it("affiche les informations de l'utilisateur", async () => {
      // Naviguer vers la route
      await router.push('/admin/user/ANXX123');
      await flushPromises();
  
      // Vérifier que les données utilisateur sont affichées
      expect(userDetailsWrapper.text()).toContain('First name: John');
      expect(userDetailsWrapper.text()).toContain('Last name: Doe');
      expect(userDetailsWrapper.text()).toContain('Mail: john.doe@gmail.com');
      expect(userDetailsWrapper.text()).toContain('Role: user');
  
      // Vérifier les valeurs dans les champs d'entrée
      expect(userDetailsWrapper.find('input[placeholder="Enter first name"]').element.value).toBe('John');
      expect(userDetailsWrapper.find('input[placeholder="Enter last name"]').element.value).toBe('Doe');
      expect(userDetailsWrapper.find('input[placeholder="Enter email"]').element.value).toBe('john.doe@gmail.com');
      expect(userDetailsWrapper.find('input[placeholder="Enter role"]').element.value).toBe('user');
    });
  });