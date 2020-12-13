import {$, $$, data, html, toggleClass, toNumber} from 'uikit-util';

export default {

    data: {
        selNav: false
    },

    computed: {

        nav({selNav}, $el) {
            return $(selNav, $el);
        },

        selNavItem({attrItem}) {
            return `[${attrItem}],[data-${attrItem}]`;
        },

        navItems(_, $el) {
            return $$(this.selNavItem, $el);
        }

    },

    update: {

        write() {

            if (this.nav && this.length !== this.nav.children.length) {
                html(this.nav, this.slides.map((_, i) => `<li ${this.attrItem}="${i}"><a href></a></li>`).join(''));
            }

            this.navItems.concat(this.nav).forEach(el => el && (el.hidden = !this.maxIndex));

            this.updateNav();

        },

        events: ['resize']

    },

    events: [

        {

            name: 'click',

            delegate() {
                return this.selNavItem;
            },

            handler(e) {
                e.preventDefault();
                this.show(data(e.current, this.attrItem));
            }

        },

        {

            name: 'itemshow',
            handler: 'updateNav'

        }

    ],

    methods: {

        updateNav() {

            const i = this.getValidIndex();
            this.navItems.forEach(el => {

                const cmd = data(el, this.attrItem);

                toggleClass(el, this.clsActive, toNumber(cmd) === i);
                toggleClass(el, 'uk-invisible', this.finite && (cmd === 'previous' && i === 0 || cmd === 'next' && i >= this.maxIndex));
            });

        }

    }

};
