import Togglable from '../mixin/togglable';
import {$$, attr, children, css, data, endsWith, getIndex, includes, index, matches, queryAll, toggleClass, toNodes, within} from 'uikit-util';

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
        attrItem: 'uk-switcher-item'
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
            return index(this.toggles, this.toggles.filter(el => within(el, `.${this.cls}`)));
        },

        show(item) {

            const prev = this.index();
            const next = getIndex(item, this.toggles, prev);

            this.toggles.forEach((toggle, i) => {
                toggleClass(children(this.$el).filter(el => within(toggle, el)), this.cls, next === i);
                attr(toggle, 'aria-expanded', next === i);
            });

            this.connects.forEach(({children}) =>
                this.toggleElement(toNodes(children).filter((child, i) =>
                    i !== next && this.isToggled(child)
                ), false, ~prev).then(() =>
                    this.toggleElement(children[next], true, ~prev)
                )
            );
        }

    }

};
