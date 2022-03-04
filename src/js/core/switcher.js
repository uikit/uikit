import Lazyload from '../mixin/lazyload';
import Swipe from '../mixin/swipe';
import Togglable from '../mixin/togglable';
import {
    $$,
    attr,
    children,
    css,
    data,
    endsWith,
    findIndex,
    getIndex,
    hasClass,
    matches,
    queryAll,
    toggleClass,
    toNodes,
    within,
} from 'uikit-util';

export default {
    mixins: [Lazyload, Swipe, Togglable],

    args: 'connect',

    props: {
        connect: String,
        toggle: String,
        itemNav: String,
        active: Number,
    },

    data: {
        connect: '~.uk-switcher',
        toggle: '> * > :first-child',
        itemNav: false,
        active: 0,
        cls: 'uk-active',
        attrItem: 'uk-switcher-item',
    },

    computed: {
        connects: {
            get({ connect }, $el) {
                return queryAll(connect, $el);
            },

            watch(connects) {
                if (this.swiping) {
                    css(connects, 'touch-action', 'pan-y pinch-zoom');
                }

                const index = this.index();
                this.connects.forEach((el) =>
                    children(el).forEach((child, i) => toggleClass(child, this.cls, i === index))
                );
            },

            immediate: true,
        },

        toggles: {
            get({ toggle }, $el) {
                return $$(toggle, $el).filter(
                    (el) => !matches(el, '.uk-disabled *, .uk-disabled, [disabled]')
                );
            },

            watch(toggles) {
                const active = this.index();
                this.show(~active ? active : toggles[this.active] || toggles[0]);
            },

            immediate: true,
        },

        children() {
            return children(this.$el).filter((child) =>
                this.toggles.some((toggle) => within(toggle, child))
            );
        },

        swipeTarget(props, $el) {
            return this.connects;
        },
    },

    connected() {
        this.lazyload(this.$el, this.connects);
    },

    events: [
        {
            name: 'click',

            delegate() {
                return this.toggle;
            },

            handler(e) {
                e.preventDefault();
                this.show(e.current);
            },
        },

        {
            name: 'click',

            el() {
                return this.connects.concat(this.itemNav ? queryAll(this.itemNav, this.$el) : []);
            },

            delegate() {
                return `[${this.attrItem}],[data-${this.attrItem}]`;
            },

            handler(e) {
                e.preventDefault();
                this.show(data(e.current, this.attrItem));
            },
        },

        {
            name: 'swipeRight swipeLeft',

            filter() {
                return this.swiping;
            },

            el() {
                return this.connects;
            },

            handler({ type }) {
                this.show(endsWith(type, 'Left') ? 'next' : 'previous');
            },
        },
    ],

    methods: {
        index() {
            return findIndex(this.children, (el) => hasClass(el, this.cls));
        },

        show(item) {
            const prev = this.index();
            const next = getIndex(
                this.children[getIndex(item, this.toggles, prev)],
                children(this.$el)
            );

            if (prev === next) {
                return;
            }

            this.children.forEach((child, i) => {
                toggleClass(child, this.cls, next === i);
                attr(this.toggles[i], 'aria-expanded', next === i);
            });

            this.connects.forEach(async ({ children }) => {
                await this.toggleElement(
                    toNodes(children).filter((child) => hasClass(child, this.cls)),
                    false,
                    prev >= 0
                );
                await this.toggleElement(children[next], true, prev >= 0);
            });
        },
    },
};
