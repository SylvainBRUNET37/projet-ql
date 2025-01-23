import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import sidebar from '@/components/sideBar/sidebar.vue';
import { getAuth, signOut } from 'firebase/auth';


vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    signOut: vi.fn().mockImplementation(() => Promise.resolve()),
}));

describe('Sidebar.vue', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = mount(sidebar, {
        global: {
            mocks: {
            $router: {
                push: vi.fn(),
            },
            },
        },
        });
    });

    it('Logout', async () => {
        const logoutButton = wrapper.findComponent({name: 'CSidebarToggler'});

        await logoutButton.trigger('click');

        expect(signOut).toHaveBeenCalled();

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/Auth');
    });
});
