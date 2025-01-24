import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AddMaterialView from '@/views/AddMaterialView.vue';
import { EquipmentStore } from '@/stores/EquipmentStore';
import { createPinia, setActivePinia } from 'pinia';

//Fichier qui est concerné par le test
describe('AddMaterialView.vue', () => {
    //wrapper représente le component testé, authStore le système d'authentification
    let wrapper: any;
    let authStore: any;

    //Avant chaque test, on initialise wrapper et authStore, Pinia est obligatoire pour bien initialiser les stores
    beforeEach(() => {
        setActivePinia(createPinia());
        wrapper = mount(AddMaterialView);
        authStore = EquipmentStore();
    })

    //Tous les tests qui utilisent le mot clé await doivent être async !
    it('Un ou plusieurs champs ne sont pas remplis.', async () => {
      const nameInput = wrapper.find('#name');
      const typeInput = wrapper.find('#type');
      const refInput = wrapper.find('#ref');
      const descriptionInput = wrapper.find('#description');
      const addEquipmentButton = wrapper.find('button[type="submit"]');
        //await permet d'attendre qu'une opération soit terminée avant de continuer le code
        //on peut donner des valeurs aux champs avec setValue
        await nameInput.setValue('');
        await typeInput.setValue('');
        await refInput.setValue('');
        await descriptionInput.setValue('');

        //trigger simule un évènement, blur permet de valider un champ
        await nameInput.trigger('blur');
        await typeInput.trigger('blur');
        await refInput.trigger('blur');
        await descriptionInput.trigger('blur');

        //on regarde si le bouton est bien désactivé
        expect(wrapper.vm.errors.name).toBe('Name is required');
        expect(wrapper.vm.errors.type).toBe('Type is required');
        expect(wrapper.vm.errors.ref).toBe('Reference is required');
        expect(wrapper.vm.errors.description).toBe('Description is required');
        expect(addEquipmentButton.attributes('disabled')).toBeDefined();
    });

    it('Le nom n\'est pas valide.', async () => {
        const nameInput = wrapper.find('#name');
        const addEquipmentButton = wrapper.find('button[type="submit"]');

        //charactère non alphanumérique
        await nameInput.setValue('a!');
        await nameInput.trigger('blur');

        //on regarde si le message d'erreur est bien mis et au bon endroit puis si le bouton est désactivé
        expect(wrapper.vm.errors.name).toBe('Invalid name');
        expect(addEquipmentButton.attributes('disabled')).toBeDefined();

        await nameInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        await nameInput.trigger('blur');

        expect(wrapper.vm.errors.name).toBe('Invalid name');
        expect(addEquipmentButton.attributes('disabled')).toBeDefined();

    });

    it('Le type n\'est pas valide.', async () => {
      const nameInput = wrapper.find('#type');
      const addEquipmentButton = wrapper.find('button[type="submit"]');

      //charactère non alphanumérique
      await nameInput.setValue('a!');
      await nameInput.trigger('blur');

      //on regarde si le message d'erreur est bien mis et au bon endroit puis si le bouton est désactivé
      expect(wrapper.vm.errors.name).toBe('Invalid type');
      expect(addEquipmentButton.attributes('disabled')).toBeDefined();

      await nameInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      await nameInput.trigger('blur');

      expect(wrapper.vm.errors.name).toBe('Invalid type');
      expect(addEquipmentButton.attributes('disabled')).toBeDefined();

    });

    it('La description n\'est pas valide.', async () => {
      const nameInput = wrapper.find('#description');
      const addEquipmentButton = wrapper.find('button[type="submit"]');

      //charactère non alphanumérique
      await nameInput.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      await nameInput.trigger('blur');

      //on regarde si le message d'erreur est bien mis et au bon endroit puis si le bouton est désactivé
      expect(wrapper.vm.errors.name).toBe('Invalid description');
      expect(addEquipmentButton.attributes('disabled')).toBeDefined();

    });

    it('Le bouton s\'active quand les champs sont remplis correctement.', async () => {
      const nameInput = wrapper.find('#name');
      const typeInput = wrapper.find('#type');
      const refInput = wrapper.find('#ref');
      const descriptionInput = wrapper.find('#description');
      const addEquipmentButton = wrapper.find('button[type="submit"]');
      //await permet d'attendre qu'une opération soit terminée avant de continuer le code
      //on peut donner des valeurs aux champs avec setValue
      await nameInput.setValue('clavierCool');
      await typeInput.setValue('clavier');
      await refInput.setValue('XX123');
      await descriptionInput.setValue('voici un super clavier');

      //trigger simule un évènement, blur permet de valider un champ
      await nameInput.trigger('blur');
      await typeInput.trigger('blur');
      await refInput.trigger('blur');
      await descriptionInput.trigger('blur');

      //L'état disabled du bouton ne doit pas être défini
      expect(addEquipmentButton.attributes('disabled')).toBeUndefined();
    });

    it('Les informations sont conformes mais ne correspondent pas à un utilisateur existant.', async () => {
        const nameInput = wrapper.find('#name');
        const typeInput = wrapper.find('input[type="password"]');
        const addEquipmentButton = wrapper.find('button[type="submit"]');

        //On va mocker (= simuler) un système d'authentification
        const loginMock = vi.spyOn(authStore, 'login').mockImplementation(() => {
            const users: any[] = []; //liste d'utilisateurs vide pour simuler une bdd vide
            //on cherche l'user
            const user = users.find(user => user.email === 'emailvalide@gmail.com' && user.password === '123456');

            if (!user) {
                authStore.errorMessage = "User doesn't exist";
            }
            else authStore.userData = user;

            return Promise.resolve();
        });

        wrapper.vm.$router = { push: vi.fn() }; //Permet de mocker (=simuler) un router

        //On met les informations et on trigger l'évènement submit du bouton
        await nameInput.setValue('emailvalide@gmail.com');
        await nameInput.trigger('blur');

        await typeInput.setValue('123456');
        await typeInput.trigger('blur');

        await addEquipmentButton.trigger('submit');

        //Le système d'authentification doit être appelé et il doit y avoir une erreur
        expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456');
        expect(wrapper.vm.errorMessage).toBe("User doesn't exist");
        expect(wrapper.vm.$router.push).not.toHaveBeenCalledWith('/home'); //Pas de changement de route vers /home détecté
    });

    it('Login OK', async () => {
        //Même chose que le test d'avant mais on a un user existant dans la bdd
        const nameInput = wrapper.find('#name');
        const typeInput = wrapper.find('input[type="password"]');
        const addEquipmentButton = wrapper.find('button[type="submit"]');

        const loginMock = vi.spyOn(authStore, 'login').mockImplementation(() => {
            const users: any[] = [{ email: 'emailvalide@gmail.com', password: '123456'}];
            const user = users.find(user => user.email === 'emailvalide@gmail.com' && user.password === '123456');

            if (!user) {
                authStore.errorMessage = "User doesn't exist";
            }
            else authStore.userData = user;

            return Promise.resolve();
        });

        wrapper.vm.$router = { push: vi.fn() };

        await nameInput.setValue('emailvalide@gmail.com');
        await nameInput.trigger('blur');

        await typeInput.setValue('123456');
        await typeInput.trigger('blur');

        await addEquipmentButton.trigger('submit');

        expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456');
        expect(wrapper.vm.errorMessage).toBe(''); //Pas de message d'erreur
        expect(authStore.userData).toEqual({ email: 'emailvalide@gmail.com', password: '123456' });
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home'); //Le changement de route vers /home doit être détecté
    });
}
);
