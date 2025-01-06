import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RegisterFormView from '@/views/RegisterFormView.vue';
import { RegisterStore } from '@/stores/RegisterStore';
import { createPinia, setActivePinia } from 'pinia';

describe('RegisterFormView.vue', () => {
    let wrapper: any;
    let registerStore: any;
    
    beforeEach(() => {
        setActivePinia(createPinia());
        wrapper = mount(RegisterFormView);
        registerStore = RegisterStore();
    });

    it('Le formulaire existe.', () => {       
        const firstNameInput = wrapper.find('#firstName');
        const lastNameInput = wrapper.find('#lastName');
        const emailInput = wrapper.find('#email');
        const roleInput = wrapper.find('#role');
        const passwordInput = wrapper.find('#password');
        const confirmPasswordInput = wrapper.find('#confirmPassword');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(firstNameInput.exists()).toBe(true);
        expect(lastNameInput.exists()).toBe(true);
        expect(emailInput.exists()).toBe(true);
        expect(roleInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(confirmPasswordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });

    it('Un ou plusieurs champs ne sont pas remplis.', async () => {
        const firstNameInput = wrapper.find('#firstName');
        const lastNameInput = wrapper.find('#lastName');
        const emailInput = wrapper.find('#email');
        const roleInput = wrapper.find('#role');
        const passwordInput = wrapper.find('#password');
        const confirmPasswordInput = wrapper.find('#confirmPassword');
        const submitButton = wrapper.find('button[type="submit"]');

        await firstNameInput.setValue('');
        await lastNameInput.setValue('');
        await emailInput.setValue('');
        await roleInput.setValue('');
        await passwordInput.setValue('');
        await confirmPasswordInput.setValue('');

        await firstNameInput.trigger('blur');
        await lastNameInput.trigger('blur');
        await emailInput.trigger('blur');
        await roleInput.trigger('blur');
        await passwordInput.trigger('blur');
        await confirmPasswordInput.trigger('blur');

        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le nom/prénom n\'est pas valide.', async () => {
        const firstNameInput = wrapper.find('#firstName');
        const lastNameInput = wrapper.find('#lastName');
        const submitButton = wrapper.find('button[type="submit"]');

        await firstNameInput.setValue('a!');
        await lastNameInput.setValue('b!');

        await firstNameInput.trigger('blur');
        await lastNameInput.trigger('blur');
        
        expect(wrapper.vm.errors.firstName).toBe('Invalid firstname');
        expect(wrapper.vm.errors.lastName).toBe('Invalid lastname');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le mail n\'est pas valide.', async () => {
        const emailInput = wrapper.find('#email');
        const submitButton = wrapper.find('button[type="submit"]');

        await emailInput.setValue('invalidemail');

        await emailInput.trigger('blur');
        
        expect(wrapper.vm.errors.email).toBe('Invalid email');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le rôle n\'est pas valide.', async () => {
        const roleInput = wrapper.find('#role');
        const submitButton = wrapper.find('button[type="submit"]');

        await roleInput.setValue('invalidrole');

        await roleInput.trigger('blur');
        
        expect(wrapper.vm.errors.role).toBe('Invalid role');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le mot de passe n\'est pas valide.', async () => {
        const passwordInput = wrapper.find('#password');
        const submitButton = wrapper.find('button[type="submit"]');

        await passwordInput.setValue('12345');

        await passwordInput.trigger('blur');
        
        expect(wrapper.vm.errors.password).toBe('Password must be between 6 and 20 characters');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('La confirmation de mot de passe ne correspond pas au mot de passe', async () => {
        const passwordInput = wrapper.find('#password');
        const confirmPasswordInput = wrapper.find('#confirmPassword');
        const submitButton = wrapper.find('button[type="submit"]');

        await passwordInput.setValue('123456');
        await confirmPasswordInput.setValue('1234567');

        await passwordInput.trigger('blur');
        await confirmPasswordInput.trigger('blur');
        
        expect(wrapper.vm.errors.confirmPassword).toBe('Passwords do not match');
        expect(submitButton.attributes('disabled')).toBeDefined();
    });

    it('Le bouton s\'active quand les champs sont remplis correctement.', async () => {
        const firstNameInput = wrapper.find('#firstName');
        const lastNameInput = wrapper.find('#lastName');
        const emailInput = wrapper.find('#email');
        const roleInput = wrapper.find('#role');
        const passwordInput = wrapper.find('#password');
        const confirmPasswordInput = wrapper.find('#confirmPassword');
        const submitButton = wrapper.find('button[type="submit"]');

        await firstNameInput.setValue('John');
        await lastNameInput.setValue('Doe');
        await emailInput.setValue('johndoe@gmail.com');
        await roleInput.setValue('admin');
        await passwordInput.setValue('123456');
        await confirmPasswordInput.setValue('123456');

        await firstNameInput.trigger('blur');
        await lastNameInput.trigger('blur');
        await emailInput.trigger('blur');
        await roleInput.trigger('blur');
        await passwordInput.trigger('blur');
        await confirmPasswordInput.trigger('blur');

        expect(submitButton.attributes('disabled')).toBeUndefined();
    });

    
});