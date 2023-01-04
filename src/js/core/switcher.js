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
    includes,
    isNode,
    matches,
    queryAll,
    toggleClass,
    toNodes,
    within,
} from 'uikit-util';
import { generateId, keyMap } from '../mixin/utils';

const selDisabled = '.uk-disabled *, .uk-disabled, [disabled]';

export default {
    mixins: [Lazyload, Swipe, Togglable],

    args: 'connect',

    props: {
        connect: String,
        toggle: String,
        itemNav: String,
        active: Number,
        followFocus: Boolean,
    },

    data: {
        connect: '~.uk-switcher',
        toggle: '> * > :first-child',
        itemNav: false,
        active: 0,
        cls: 'uk-active',
        attrItem: 'uk-switcher-item',
        selVertical: '.uk-nav',
        followFocus: false,
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
                return $$(toggle, $el);
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
            name: 'click keydown',

            delegate() {
                return this.toggle;
            },

            handler(e) {
                if (
                    !matches(e.current, selDisabled) &&
                    (e.type === 'click' || e.keyCode === keyMap.SPACE)
                ) {
                    e.preventDefault();
                    this.show(e.current);
                }
            },
        },

        {
            name: 'keydown',

            delegate() {
                return this.toggle;
            },

            handler(e) {
                const { current, keyCode } = e;
                const isVertical = matches(this.$el, this.selVertical);

                let i =
                    keyCode === keyMap.HOME
                        ? 0
                        : keyCode === keyMap.END
                        ? 'last'
                        : (keyCode === keyMap.LEFT && !isVertical) ||
                          (keyCode === keyMap.UP && isVertical)
                        ? 'previous'
                        : (keyCode === keyMap.RIGHT && !isVertical) ||
                          (keyCode === keyMap.DOWN && isVertical)
                        ? 'next'
                        : -1;

                if (~i) {
                    e.preventDefault();
                    const toggles = this.toggles.filter((el) => !matches(el, selDisabled));
                    const next = toggles[getIndex(i, toggles, toggles.indexOf(current))];
                    next.focus();
                    if (this.followFocus) {
                        this.show(next);
                    }
                }
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
        attr(this.connects, 'role', 'presentation');
        attr(children(this.$el), 'role', 'presentation');

        for (const index in this.toggles) {
            const toggle = this.toggles[index];
            const item = this.connects[0]?.children[index];

            attr(toggle, 'role', 'tab');

            if (!item) {
                continue;
            }

            toggle.id = generateId(this, toggle, `-tab-${index}`);
            item.id = generateId(this, item, `-tabpanel-${index}`);

            attr(toggle, 'aria-controls', item.id);
            attr(item, { role: 'tabpanel', 'aria-labelledby': toggle.id });
        }
        attr(this.$el, 'aria-orientation', matches(this.$el, this.selVertical) ? 'vertical' : null);
    },

    methods: {
        index() {
            return findIndex(this.children, (el) => hasClass(el, this.cls));
        },

        show(item) {
            const toggles = this.toggles.filter((el) => !matches(el, selDisabled));
            const prev = this.index();
            const next = getIndex(
                !isNode(item) || includes(toggles, item) ? item : 0,
                toggles,
                getIndex(this.toggles[prev], toggles)
            );
            const active = getIndex(toggles[next], this.toggles);

            this.children.forEach((child, i) => {
                toggleClass(child, this.cls, active === i);
                attr(this.toggles[i], {
                    'aria-selected': active === i,
                    tabindex: active === i ? null : -1,
                });
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
