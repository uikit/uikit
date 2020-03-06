import Togglable from '../mixin/togglable';
import {$$, addClass, attr, children, css, data, endsWith, filter, getIndex, includes, index, isEmpty, matches, queryAll, removeClass, within} from 'uikit-util';

export default {

    mixins: [Togglable],

    args: 'connect',

    props: {
        connect: String,
        toggle: String,
        active: Number,
        swiping: Boolean
    },

    data: {
        connect: '~.uk-switcher',
        toggle: '> * > :first-child',
        active: 0,
        swiping: true,
        cls: 'uk-active',
        clsContainer: 'uk-switcher',
        attrItem: 'uk-switcher-item',
        queued: true
    },

    computed: {

        connects: {

            get({connect}, $el) {
                return queryAll(connect, $el);
            },

            watch(connects) {

                connects.forEach(list => this.updateAria(list.children));

                if (this.swiping) {
                    css(connects, 'touch-action', 'pan-y pinch-zoom');
                }

            },

            immediate: true

        },

        toggles: {

            get({toggle}, $el) {
                return $$(toggle, $el).filter(el => !matches(el, '.uk-disabled *, .uk-disabled, [disabled]'));
            },

            watch(toggles) {
                const active = this.index();
                this.show(~active && active || toggles[this.active] || toggles[0]);
            },

            immediate: true

        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return this.toggle;
            },

            handler(e) {
                if (!includes(this.toggles, e.current)) {
                    return;
                }
                e.preventDefault();
                this.show(e.current);
            }

        },

        {
            name: 'click',

            el() {
                return this.connects;
            },

            delegate() {
                return `[${this.attrItem}],[data-${this.attrItem}]`;
            },

            handler(e) {
                e.preventDefault();
                this.show(data(e.current, this.attrItem));
            }
        },

        {
            name: 'swipeRight swipeLeft',

            filter() {
                return this.swiping;
            },

            el() {
                return this.connects;
            },

            handler({type}) {
                this.show(endsWith(type, 'Left') ? 'next' : 'previous');
            }
        }

    ],

    methods: {

        index() {
            return index(filter(children(this.connects[0]), `.${this.cls}`)[0]);
        },

        show(item) {

            const {toggles} = this;
            const prev = this.index();
            const hasPrev = prev >= 0;

            const next = getIndex(item, toggles, prev);
            const toggle = toggles[next];

            if (!toggle || prev === next) {
                return;
            }

            const ancestors = children(this.$el);
            removeClass(ancestors, this.cls);
            addClass(ancestors.filter(ancestor => within(toggle, ancestor))[0], this.cls);

            attr(this.toggles, 'aria-expanded', false);
            attr(toggle, 'aria-expanded', true);

            this.connects.forEach(list => {
                if (!hasPrev) {
                    this.toggleNow(list.children[next]);
                } else {
                    this.toggleElement([list.children[prev], list.children[next]]);
                }
            });

        }

    }

};
