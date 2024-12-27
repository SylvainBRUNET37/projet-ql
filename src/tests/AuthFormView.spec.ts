import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import AuthFormView from '@/views/AuthFormView.vue';
import { AuthStore } from '@/stores/AuthStore';
import { createPinia, setActivePinia } from 'pinia';

describe('AuthFormView.vue', () => {
    let wrapper: any;
    let authStore: any;

    beforeEach(() => {
        setActivePinia(createPinia());
        wrapper = mount(AuthFormView);
        authStore = AuthStore();
    })

    it('Le formulaire existe.', () => {        
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });

    it('Un ou plusieurs champs ne sont pas remplis.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        await emailInput.setValue('');
        await passwordInput.setValue('');

        await emailInput.trigger('blur');
        await passwordInput.trigger('blur');

        expect(submitButton.attributes('disabled')).toBeDefined;
    });

    it('Le mail n\'est pas valide.', async () => {
        const emailInput = wrapper.find('input[type="email"]');
        const submitButton = wrapper.find('button[type="submit"]');

        await emailInput.setValue('invalidemail');
        await emailInput.trigger('blur');
        
        expect(wrapper.vm.errors.email).toBe('Invalid email');
        expect(submitButton.attributes('disabled')).toBeDefined;
    })

    it('Le mot de passe n\'est pas valide.', async () => {
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        await passwordInput.setValue('12345');
        await passwordInput.trigger('blur');
        
        expect(wrapper.vm.errors.password).toBe('Invalid password');
        expect(submitButton.attributes('disabled')).toBeDefined;
    })
}
);