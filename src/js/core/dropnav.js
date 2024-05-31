import {
    $,
    $$,
    addClass,
    after,
    css,
    findIndex,
    getIndex,
    hasClass,
    height,
    includes,
    isInput,
    isRtl,
    matches,
    noop,
    observeResize,
    offset,
    parents,
    query,
    remove,
    selFocusable,
    toFloat,
    Transition,
} from 'uikit-util';
import Class from '../mixin/class';
import Container from '../mixin/container';
import { keyMap } from '../util/keys';
import { active } from './drop';

export default {
    mixins: [Class, Container],

    props: {
        align: String,
        clsDrop: String,
        boundary: Boolean,
        dropbar: Boolean,
        dropbarAnchor: Boolean,
        duration: Number,
        mode: Boolean,
        offset: Boolean,
        stretch: Boolean,
        delayShow: Boolean,
        delayHide: Boolean,
        target: Boolean,
        targetX: Boolean,
        targetY: Boolean,
        animation: Boolean,
        animateOut: Boolean,
        closeOnScroll: Boolean,
    },

    data: {
        align: isRtl ? 'right' : 'left',
        clsDrop: 'uk-dropdown',
        clsDropbar: 'uk-dropnav-dropbar',
        boundary: true,
        dropbar: false,
        dropbarAnchor: false,
        duration: 200,
        container: false,
        selNavItem: '> li > a, > ul > li > a',
    },

    computed: {
        dropbarAnchor: ({ dropbarAnchor }, $el) => query(dropbarAnchor, $el) || $el,

        dropbar({ dropbar }) {
            if (!dropbar) {
                return null;
            }

            dropbar =
                this._dropbar || query(dropbar, this.$el) || $(`+ .${this.clsDropbar}`, this.$el);

            return dropbar ? dropbar : (this._dropbar = $('<div></div>'));
        },

        dropContainer(_, $el) {
            return this.container || $el;
        },

        dropdowns({ clsDrop }, $el) {
            const dropdowns = $$(`.${clsDrop}`, $el);

            if (this.dropContainer !== $el) {
                for (const el of $$(`.${clsDrop}`, this.dropContainer)) {
                    const target = this.getDropdown(el)?.targetEl;
                    if (!includes(dropdowns, el) && target && this.$el.contains(target)) {
                        dropdowns.push(el);
                    }
                }
            }

            return dropdowns;
        },

        items({ selNavItem }, $el) {
            return $$(selNavItem, $el);
        },
    },

    watch: {
        dropbar(dropbar) {
            addClass(
                dropbar,
                'uk-dropbar',
                'uk-dropbar-top',
                this.clsDropbar,
                `uk-${this.$options.name}-dropbar`,
            );
        },

        dropdowns() {
            this.initializeDropdowns();
        },
    },

    connected() {
        this.initializeDropdowns();
    },

    disconnected() {
        remove(this._dropbar);
        delete this._dropbar;
    },

    events: [
        {
            name: 'mouseover focusin',

            delegate: ({ selNavItem }) => selNavItem,

            handler({ current }) {
                const active = this.getActive();
                if (
                    active &&
                    includes(active.mode, 'hover') &&
                    active.targetEl &&
                    !current.contains(active.targetEl) &&
                    !active.isDelaying()
                ) {
                    active.hide(false);
                }
            },
        },

        {
            name: 'keydown',

            self: true,

            delegate: ({ selNavItem }) => selNavItem,

            handler(e) {
                const { current, keyCode } = e;
                const active = this.getActive();

                if (keyCode === keyMap.DOWN && active?.targetEl === current) {
                    e.preventDefault();
                    $(selFocusable, active.$el)?.focus();
                }

                handleNavItemNavigation(e, this.items, active);
            },
        },

        {
            name: 'keydown',

            el: ({ dropContainer }) => dropContainer,

            delegate: ({ clsDrop }) => `.${clsDrop}`,

            handler(e) {
                const { current, keyCode, target } = e;

                if (isInput(target) || !includes(this.dropdowns, current)) {
                    return;
                }

                const active = this.getActive();
                let next = -1;

                if (keyCode === keyMap.HOME) {
                    next = 0;
                } else if (keyCode === keyMap.END) {
                    next = 'last';
                } else if (keyCode === keyMap.UP) {
                    next = 'previous';
                } else if (keyCode === keyMap.DOWN) {
                    next = 'next';
                } else if (keyCode === keyMap.ESC) {
                    active.targetEl?.focus();
                }

                if (~next) {
                    e.preventDefault();
                    const elements = $$(selFocusable, current);
                    elements[
                        getIndex(
                            next,
                            elements,
                            findIndex(elements, (el) => matches(el, ':focus')),
                        )
                    ].focus();
                }

                handleNavItemNavigation(e, this.items, active);
            },
        },

        {
            name: 'mouseleave',

            el: ({ dropbar }) => dropbar,

            filter: ({ dropbar }) => dropbar,

            handler() {
                const active = this.getActive();

                if (
                    active &&
                    includes(active.mode, 'hover') &&
                    !this.dropdowns.some((el) => matches(el, ':hover'))
                ) {
                    active.hide();
                }
            },
        },

        {
            name: 'beforeshow',

            el: ({ dropContainer }) => dropContainer,

            filter: ({ dropbar }) => dropbar,

            handler({ target }) {
                if (!this.isDropbarDrop(target)) {
                    return;
                }

                if (this.dropbar.previousElementSibling !== this.dropbarAnchor) {
                    after(this.dropbarAnchor, this.dropbar);
                }

                addClass(target, `${this.clsDrop}-dropbar`);
            },
        },

        {
            name: 'show',

            el: ({ dropContainer }) => dropContainer,

            filter: ({ dropbar }) => dropbar,

            handler({ target }) {
                if (!this.isDropbarDrop(target)) {
                    return;
                }

                const drop = this.getDropdown(target);
                const adjustHeight = () => {
                    const maxBottom = Math.max(
                        ...parents(target, `.${this.clsDrop}`)
                            .concat(target)
                            .map((el) => offset(el).bottom),
                    );

                    offset(this.dropbar, {
                        left: offset(this.dropbar).left,
                        top: this.getDropbarOffset(drop.getPositionOffset()),
                    });
                    this.transitionTo(
                        maxBottom - offset(this.dropbar).top + toFloat(css(target, 'marginBottom')),
                        target,
                    );
                };
                this._observer = observeResize([drop.$el, ...drop.target], adjustHeight);
                adjustHeight();
            },
        },

        {
            name: 'beforehide',

            el: ({ dropContainer }) => dropContainer,

            filter: ({ dropbar }) => dropbar,

            handler(e) {
                const active = this.getActive();

                if (
                    matches(this.dropbar, ':hover') &&
                    active.$el === e.target &&
                    this.isDropbarDrop(active.$el) &&
                    includes(active.mode, 'hover') &&
                    active.isDelayedHide &&
                    !this.items.some((el) => active.targetEl !== el && matches(el, ':focus'))
                ) {
                    e.preventDefault();
                }
            },
        },

        {
            name: 'hide',

            el: ({ dropContainer }) => dropContainer,

            filter: ({ dropbar }) => dropbar,

            handler({ target }) {
                if (!this.isDropbarDrop(target)) {
                    return;
                }

                this._observer?.disconnect();

                const active = this.getActive();

                if (!active || active.$el === target) {
                    this.transitionTo(0);
                }
            },
        },
    ],

    methods: {
        getActive() {
            return includes(this.dropdowns, active?.$el) && active;
        },

        async transitionTo(newHeight, el) {
            const { dropbar } = this;
            const oldHeight = height(dropbar);

            el = oldHeight < newHeight && el;

            await Transition.cancel([el, dropbar]);

            if (el) {
                const diff = offset(el).top - offset(dropbar).top - oldHeight;
                if (diff > 0) {
                    css(el, 'transitionDelay', `${(diff / newHeight) * this.duration}ms`);
                }
            }

            css(el, 'clipPath', `polygon(0 0,100% 0,100% ${oldHeight}px,0 ${oldHeight}px)`);
            height(dropbar, oldHeight);

            await Promise.all([
                Transition.start(dropbar, { height: newHeight }, this.duration),
                Transition.start(
                    el,
                    { clipPath: `polygon(0 0,100% 0,100% ${newHeight}px,0 ${newHeight}px)` },
                    this.duration,
                ).finally(() => css(el, { clipPath: '', transitionDelay: '' })),
            ]).catch(noop);
        },

        getDropdown(el) {
            return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        },

        isDropbarDrop(el) {
            return includes(this.dropdowns, el) && hasClass(el, this.clsDrop);
        },

        getDropbarOffset(offsetTop) {
            const { $el, target, targetY } = this;
            const { top, height } = offset(query(targetY || target || $el, $el));
            return top + height + offsetTop;
        },

        initializeDropdowns() {
            this.$create(
                'drop',
                this.dropdowns.filter((el) => !this.getDropdown(el)),
                {
                    ...this.$props,
                    flip: false,
                    shift: true,
                    pos: `bottom-${this.align}`,
                    boundary: this.boundary === true ? this.$el : this.boundary,
                },
            );
        },
    },
};

function handleNavItemNavigation(e, toggles, active) {
    const { current, keyCode } = e;
    let next = -1;

    if (keyCode === keyMap.HOME) {
        next = 0;
    } else if (keyCode === keyMap.END) {
        next = 'last';
    } else if (keyCode === keyMap.LEFT) {
        next = 'previous';
    } else if (keyCode === keyMap.RIGHT) {
        next = 'next';
    } else if (keyCode === keyMap.TAB) {
        active.targetEl?.focus();
        active.hide?.(false);
    }

    if (~next) {
        e.preventDefault();
        active.hide?.(false);
        toggles[getIndex(next, toggles, toggles.indexOf(active.targetEl || current))].focus();
    }
}
