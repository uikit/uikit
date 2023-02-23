import Dropnav from './dropnav';
import { $$, attr, css, hasClass } from 'uikit-util';

export default {
    extends: Dropnav,

    data: {
        dropdown: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
        clsDrop: 'uk-navbar-dropdown',
    },

    computed: {
        items: {
            get({ dropdown }, $el) {
                return $$(dropdown, $el);
            },

            watch(items) {
                const justify = hasClass(this.$el, 'uk-navbar-justify');
                for (const container of $$(
                    '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
                    this.$el
                )) {
                    css(container, 'flexGrow', justify ? $$(this.dropdown, container).length : '');
                }

                attr($$('.uk-navbar-nav', this.$el), 'role', 'group');
                attr($$('.uk-navbar-nav > *', this.$el), 'role', 'presentation');
                attr(items, { tabindex: -1, role: 'menuitem' });
                attr(items[0], 'tabindex', 0);
            },

            immediate: true,
        },
    },
};
