import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AuthFormView from '@/views/AuthFormView.vue';
import { AuthStore } from '@/stores/AuthStore';
import { createPinia, setActivePinia } from 'pinia';

//Fichier qui est concerné par le test
describe('AuthFormView.vue', () => {
    //wrapper représente le component testé, authStore le système d'authentification
    let wrapper: any;
    let authStore: any;

    //Avant chaque test, on initialise wrapper et authStore, Pinia est obligatoire pour bien initialiser les stores
    beforeEach(() => {
        setActivePinia(createPinia());
        wrapper = mount(AuthFormView);
        authStore = AuthStore();
    })

    //it est le cas que l'on veut tester
    it('Le formulaire existe.', () => {       
        //On trouve les différentes parties de notre component (ici les 2 champs et le bouton) et on les associe à une constante
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        //Ce qu'il y a dans expect représente ce qu'on s'attend à voir après avoir fait le test
        //Si c'est bon, le test est réussi sinon erreur
        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });

    //Tous les tests qui utilisent le mot clé await doivent être async !
    it('Un ou plusieurs champs ne sont pas remplis.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        //await permet d'attendre qu'une opération soit terminée avant de continuer le code
        //on peut donner des valeurs aux champs avec setValue
        await emailInput.setValue('');
        await passwordInput.setValue('');

        //trigger simule un évènement, blur permet de valider un champ
        await emailInput.trigger('blur');
        await passwordInput.trigger('blur');

        //on regarde si le bouton est bien désactivé
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le mail n\'est pas valide.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const submitButton = wrapper.find('button[type="submit"]');

        //mail sans @ ni .
        await emailInput.setValue('invalidemail');
        await emailInput.trigger('blur');
        
        //on regarde si le message d'erreur est bien mis et au bon endroit puis si le bouton est désactivé
        expect(wrapper.vm.errors.email).toBe('Invalid email');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le mot de passe n\'est pas valide.', async () => {
        //pareil pour mdp trop court (< 6 caractères)
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        await passwordInput.setValue('12345');
        await passwordInput.trigger('blur');
        
        expect(wrapper.vm.errors.password).toBe('Invalid password');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le bouton s\'active quand les champs sont remplis correctement.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        await emailInput.setValue('emailvalide@gmail.com');
        await emailInput.trigger('blur');
        
        await passwordInput.setValue('123456');
        await passwordInput.trigger('blur');
        
        //L'état disabled du bouton ne doit pas être défini
        expect(submitButton.attributes('disabled')).toBeUndefined();
    });

    it('Les informations sont conformes mais ne correspondent pas à un utilisateur existant.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

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
        await emailInput.setValue('emailvalide@gmail.com');
        await emailInput.trigger('blur');

        await passwordInput.setValue('123456');
        await passwordInput.trigger('blur');

        await submitButton.trigger('submit');

        //Le système d'authentification doit être appelé et il doit y avoir une erreur
        expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456');
        expect(wrapper.vm.errorMessage).toBe("User doesn't exist");
        expect(wrapper.vm.$router.push).not.toHaveBeenCalledWith('/home'); //Pas de changement de route vers /home détecté
    });

    it('Login OK', async () => {
        //Même chose que le test d'avant mais on a un user existant dans la bdd
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

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

        await emailInput.setValue('emailvalide@gmail.com');
        await emailInput.trigger('blur');

        await passwordInput.setValue('123456');
        await passwordInput.trigger('blur');

        await submitButton.trigger('submit');

        expect(authStore.login).toHaveBeenCalledWith('emailvalide@gmail.com', '123456');
        expect(wrapper.vm.errorMessage).toBe(''); //Pas de message d'erreur
        expect(authStore.userData).toEqual({ email: 'emailvalide@gmail.com', password: '123456' });
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/home'); //Le changement de route vers /home doit être détecté
    });
}
);