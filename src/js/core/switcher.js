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
    includes,
    isNode,
    isTag,
    matches,
    queryAll,
    toArray,
    toggleClass,
} from 'uikit-util';
import { generateId } from '../api/instance';
import { lazyload, swipe } from '../api/observables';
import Togglable from '../mixin/togglable';
import { keyMap } from '../util/keys';

const selDisabled = '.uk-disabled *, .uk-disabled, [disabled]';

export default {
    mixins: [Togglable],

    args: 'connect',

    props: {
        connect: String,
        toggle: String,
        itemNav: String,
        active: Number,
        followFocus: Boolean,
        swiping: Boolean,
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
        swiping: true,
    },

    computed: {
        connects: {
            get: ({ connect }, $el) => queryAll(connect, $el),
            observe: ({ connect }) => connect,
        },

        connectChildren() {
            return this.connects.map((el) => children(el)).flat();
        },

        toggles: ({ toggle }, $el) => $$(toggle, $el),

        children(_, $el) {
            return children($el).filter((child) =>
                this.toggles.some((toggle) => child.contains(toggle)),
            );
        },
    },

    watch: {
        connects(connects) {
            if (this.swiping) {
                css(connects, 'touchAction', 'pan-y pinch-zoom');
            }
            this.$emit();
        },

        connectChildren() {
            let index = Math.max(0, this.index());
            for (const el of this.connects) {
                children(el).forEach((child, i) => toggleClass(child, this.cls, i === index));
            }
            this.$emit();
        },

        toggles(toggles) {
            this.$emit();
            const active = this.index();
            this.show(~active ? active : toggles[this.active] || toggles[0]);
        },
    },

    connected() {
        attr(this.$el, 'role', 'tablist');
    },

    observe: [
        lazyload({ targets: ({ connectChildren }) => connectChildren }),
        swipe({ target: ({ connects }) => connects, filter: ({ swiping }) => swiping }),
    ],

    events: [
        {
            name: 'click keydown',

            delegate: ({ toggle }) => toggle,

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

            delegate: ({ toggle }) => toggle,

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

            el: ({ $el, connects, itemNav }) =>
                connects.concat(itemNav ? queryAll(itemNav, $el) : []),

            delegate: ({ attrItem }) => `[${attrItem}],[data-${attrItem}]`,

            handler(e) {
                if (e.target.closest('a,button')) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }
            },
        },

        {
            name: 'swipeRight swipeLeft',

            filter: ({ swiping }) => swiping,

            el: ({ connects }) => connects,

            handler({ type }) {
                this.show(endsWith(type, 'Left') ? 'next' : 'previous');
            },
        },
    ],

    update() {
        for (const el of this.connects) {
            if (isTag(el, 'ul')) {
                attr(el, 'role', 'presentation');
            }
        }
        attr(children(this.$el), 'role', 'presentation');

        for (const index in this.toggles) {
            const toggle = this.toggles[index];
            const item = this.connects[0]?.children[index];

            attr(toggle, 'role', 'tab');

            if (!item) {
                continue;
            }

            toggle.id = generateId(this, toggle);
            item.id = generateId(this, item);

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
                getIndex(this.toggles[prev], toggles),
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
                const actives = toArray(children).filter(
                    (child, i) => i !== active && hasClass(child, this.cls),
                );

                if (await this.toggleElement(actives, false, animate)) {
                    await this.toggleElement(children[active], true, animate);
                }
            });
        },
    },
};
