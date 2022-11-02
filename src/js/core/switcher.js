import Lazyload from '../mixin/lazyload';
import Swipe from '../mixin/swipe';
import Togglable from '../mixin/togglable';
import {
    $$,
    attr,
    children,
    closest,
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
import { generateId } from '../mixin/utils';

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
                    css(connects, 'touchAction', 'pan-y pinch-zoom');
                }
                this.$emit();
            },

            document: true,
            immediate: true,
        },

        connectChildren: {
            get() {
                return this.connects.map((el) => children(el)).flat();
            },

            watch() {
                const index = this.index();
                for (const el of this.connects) {
                    children(el).forEach((child, i) => toggleClass(child, this.cls, i === index));
                    this.lazyload(this.$el, children(el));
                }
                this.$emit();
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
                this.$emit();
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

        swipeTarget() {
            return this.connects;
        },
    },

    connected() {
        attr(this.$el, 'role', 'tablist');
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
                if (closest(e.target, 'a,button')) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }
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

    update() {
        const toggles = $$(this.toggle, this.$el);
        for (const index in toggles) {
            const toggle = toggles[index];
            const item = this.connects[0]?.children[index];

            if (!item) {
                continue;
            }

            toggle.id = generateId(this, toggle, `-tab-${index}`);
            item.id = generateId(this, item, `-tabpanel-${index}`);

            attr(toggle, { role: 'tab', 'aria-controls': item.id });
            attr(item, { role: 'tabpanel', 'aria-labelledby': toggle.id });
        }
    },

    methods: {
        index() {
            return findIndex(this.children, (el) => hasClass(el, this.cls));
        },

        show(item) {
            const prev = this.index();
            const next = getIndex(item, this.toggles, prev);
            const active = getIndex(this.children[next], children(this.$el));
            children(this.$el).forEach((child, i) => {
                toggleClass(child, this.cls, active === i);
                attr(this.toggles[i], 'aria-selected', active === i);
            });

            const animate = prev >= 0 && prev !== next;
            this.connects.forEach(async ({ children }) => {
                await this.toggleElement(
                    toNodes(children).filter((child) => hasClass(child, this.cls)),
                    false,
                    animate
                );
                await this.toggleElement(children[active], true, animate);
            });
        },
    },
};
