import Dropnav from './dropnav';
import { $$, css, hasClass } from 'uikit-util';

export default {
    extends: Dropnav,

    data: {
        clsDrop: 'uk-navbar-dropdown',
        selNavItem:
            '.uk-navbar-nav > li > a,a.uk-navbar-item,button.uk-navbar-item,.uk-navbar-item a,.uk-navbar-item button,.uk-navbar-toggle', // Simplify with :where() selector once browser target is Safari 14+
    },

    watch: {
        items() {
            const justify = hasClass(this.$el, 'uk-navbar-justify');
            for (const container of $$(
                '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
                this.$el
            )) {
                css(
                    container,
                    'flexGrow',
                    justify
                        ? $$(
                              '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
                              container
                          ).length
                        : ''
                );
            }
        },
    },
};
