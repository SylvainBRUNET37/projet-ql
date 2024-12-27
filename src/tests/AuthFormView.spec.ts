import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AuthFormView from '@/views/AuthFormView.vue';

describe('AuthFormView.vue', () => {
    it('Le formulaire existe.', () => {
        const wrapper = mount(AuthFormView);
        
        const emailInput = wrapper.find('input[type="email"]');
        const passwordInput = wrapper.find('input[type="password"]');
        const submitButton = wrapper.find('button[type="submit"]');

        expect(emailInput.exists()).toBe(true);
        expect(passwordInput.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
    });
}
);