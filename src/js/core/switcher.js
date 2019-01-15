import Togglable from '../mixin/togglable';
import {$$, addClass, attr, data, filter, getIndex, hasClass, index, isTouch, matches, queryAll, removeClass, toNodes, within} from 'uikit-util';

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

        connects({connect}, $el) {
            return queryAll(connect, $el);
        },

        toggles({toggle}, $el) {
            return $$(toggle, $el);
        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return `${this.toggle}:not(.uk-disabled)`;
            },

            handler(e) {
                e.preventDefault();
                this.show(toNodes(this.$el.children).filter(el => within(e.current, el))[0]);
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

            handler(e) {
                if (!isTouch(e)) {
                    return;
                }

                e.preventDefault();
                if (!window.getSelection().toString()) {
                    this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                }
            }
        }

    ],

    update() {

        this.connects.forEach(list => this.updateAria(list.children));
        const {children} = this.$el;
        this.show(filter(children, `.${this.cls}`)[0] || children[this.active] || children[0]);

    },

    methods: {

        index() {
            return !!this.connects.length && index(filter(this.connects[0].children, `.${this.cls}`)[0]);
        },

        show(item) {

            const {children} = this.$el;
            const {length} = children;
            const prev = this.index();
            const hasPrev = prev >= 0;
            const dir = item === 'previous' ? -1 : 1;

            let toggle, active, next = getIndex(item, children, prev);

            for (let i = 0; i < length; i++, next = (next + dir + length) % length) {
                if (!matches(this.toggles[next], '.uk-disabled *, .uk-disabled, [disabled]')) {
                    toggle = this.toggles[next];
                    active = children[next];
                    break;
                }
            }

            if (!active || prev >= 0 && hasClass(active, this.cls) || prev === next) {
                return;
            }

            removeClass(children, this.cls);
            addClass(active, this.cls);
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
