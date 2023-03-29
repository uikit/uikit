import { active } from './drop';
import Class from '../mixin/class';
import Container from '../mixin/container';
import {
    $,
    $$,
    addClass,
    after,
    css,
    findIndex,
    getIndex,
    hasAttr,
    hasClass,
    height,
    includes,
    isRtl,
    matches,
    noop,
    observeResize,
    offset,
    once,
    parents,
    query,
    remove,
    selFocusable,
    toFloat,
    Transition,
    within,
} from 'uikit-util';
import { keyMap } from '../util/keys';

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
        dropbarAnchor({ dropbarAnchor }, $el) {
            return query(dropbarAnchor, $el) || $el;
        },

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
                    if (!includes(dropdowns, el) && target && within(target, this.$el)) {
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
                `uk-${this.$options.name}-dropbar`
            );
        },

        dropdowns(dropdowns) {
            this.$create(
                'drop',
                dropdowns.filter((el) => !this.getDropdown(el)),
                {
                    ...this.$props,
                    flip: false,
                    shift: true,
                    pos: `bottom-${this.align}`,
                    boundary: this.boundary === true ? this.$el : this.boundary,
                }
            );
        },
    },

    disconnected() {
        remove(this._dropbar);
        delete this._dropbar;
    },

    events: [
        {
            name: 'mouseover focusin',

            delegate() {
                return this.selNavItem;
            },

            handler({ current }) {
                const active = this.getActive();
                if (
                    active &&
                    includes(active.mode, 'hover') &&
                    active.targetEl &&
                    !within(active.targetEl, current) &&
                    !active.isDelaying
                ) {
                    active.hide(false);
                }
            },
        },

        {
            name: 'keydown',

            delegate() {
                return this.selNavItem;
            },

            handler(e) {
                const { current, keyCode } = e;
                const active = this.getActive();

                if (keyCode === keyMap.DOWN && hasAttr(current, 'aria-expanded')) {
                    e.preventDefault();

                    if (!active || active.targetEl !== current) {
                        current.click();
                        once(this.dropContainer, 'show', ({ target }) =>
                            focusFirstFocusableElement(target)
                        );
                    } else {
                        focusFirstFocusableElement(active.$el);
                    }
                }

                handleNavItemNavigation(e, this.items, active);
            },
        },

        {
            name: 'keydown',

            el() {
                return this.dropContainer;
            },

            delegate() {
                return `.${this.clsDrop}`;
            },

            handler(e) {
                const { current, keyCode } = e;

                if (!includes(this.dropdowns, current)) {
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
                            findIndex(elements, (el) => matches(el, ':focus'))
                        )
                    ].focus();
                }

                handleNavItemNavigation(e, this.items, active);
            },
        },

        {
            name: 'mouseleave',

            el() {
                return this.dropbar;
            },

            filter() {
                return this.dropbar;
            },

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

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

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

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

            handler({ target }) {
                if (!this.isDropbarDrop(target)) {
                    return;
                }

                const drop = this.getDropdown(target);
                const adjustHeight = () => {
                    const targetOffsets = parents(target, `.${this.clsDrop}`)
                        .concat(target)
                        .map((el) => offset(el));
                    const minTop = Math.min(...targetOffsets.map(({ top }) => top));
                    const maxBottom = Math.max(...targetOffsets.map(({ bottom }) => bottom));
                    const dropbarOffset = offset(this.dropbar);
                    css(this.dropbar, 'top', this.dropbar.offsetTop - (dropbarOffset.top - minTop));
                    this.transitionTo(
                        maxBottom - minTop + toFloat(css(target, 'marginBottom')),
                        target
                    );
                };
                this._observer = observeResize([drop.$el, ...drop.target], adjustHeight);
                adjustHeight();
            },
        },

        {
            name: 'beforehide',

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

            handler(e) {
                const active = this.getActive();

                if (
                    matches(this.dropbar, ':hover') &&
                    active.$el === e.target &&
                    !this.items.some((el) => active.targetEl !== el && matches(el, ':focus'))
                ) {
                    e.preventDefault();
                }
            },
        },

        {
            name: 'hide',

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

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

            css(el, 'clipPath', `polygon(0 0,100% 0,100% ${oldHeight}px,0 ${oldHeight}px)`);
            height(dropbar, oldHeight);

            await Promise.all([
                Transition.start(dropbar, { height: newHeight }, this.duration),
                Transition.start(
                    el,
                    {
                        clipPath: `polygon(0 0,100% 0,100% ${newHeight}px,0 ${newHeight}px)`,
                    },
                    this.duration
                ).finally(() => css(el, { clipPath: '' })),
            ]).catch(noop);
        },

        getDropdown(el) {
            return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        },

        isDropbarDrop(el) {
            return this.getDropdown(el) && hasClass(el, this.clsDrop);
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

function focusFirstFocusableElement(el) {
    if (!$(':focus', el)) {
        $(selFocusable, el)?.focus();
    }
}
