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

export default {
    mixins: [Class, Container],

    props: {
        dropdown: String,
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
        dropdown: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
        align: isRtl ? 'right' : 'left',
        clsDrop: 'uk-navbar-dropdown',
        boundary: true,
        dropbar: false,
        dropbarAnchor: false,
        duration: 200,
        container: false,
    },

    computed: {
        dropbarAnchor({ dropbarAnchor }, $el) {
            return query(dropbarAnchor, $el) || $el;
        },

        dropbar: {
            get({ dropbar }) {
                if (!dropbar) {
                    return null;
                }

                dropbar =
                    this._dropbar ||
                    query(dropbar, this.$el) ||
                    $('+ .uk-navbar-dropbar', this.$el);

                return dropbar ? dropbar : (this._dropbar = $('<div></div>'));
            },

            watch(dropbar) {
                addClass(dropbar, 'uk-dropbar', 'uk-dropbar-top', 'uk-navbar-dropbar');
            },

            immediate: true,
        },

        dropContainer(_, $el) {
            return this.container || $el;
        },

        dropdowns: {
            get({ clsDrop }, $el) {
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

            watch(dropdowns) {
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

            immediate: true,
        },

        toggles: {
            get({ dropdown }, $el) {
                return $$(dropdown, $el);
            },

            watch() {
                const justify = hasClass(this.$el, 'uk-navbar-justify');
                for (const container of $$(
                    '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
                    this.$el
                )) {
                    css(container, 'flexGrow', justify ? $$(this.dropdown, container).length : '');
                }
            },

            immediate: true,
        },
    },

    disconnected() {
        this.dropbar && remove(this.dropbar);
        delete this._dropbar;
    },

    events: [
        {
            name: 'mouseover focusin',

            delegate() {
                return this.dropdown;
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
                return this.dropdown;
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

                handleNavItemNavigation(e, this.toggles, active);
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
                const elements = $$(selFocusable, current);
                const i = findIndex(elements, (el) => matches(el, ':focus'));

                if (keyCode === keyMap.UP) {
                    e.preventDefault();
                    if (i > 0) {
                        elements[i - 1].focus();
                    }
                }

                if (keyCode === keyMap.DOWN) {
                    e.preventDefault();
                    if (i < elements.length - 1) {
                        elements[i + 1].focus();
                    }
                }

                if (keyCode === keyMap.ESC) {
                    active.targetEl?.focus();
                }

                handleNavItemNavigation(e, this.toggles, active);
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
                this._observer = observeResize([drop.$el, ...drop.target], () => {
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
                });
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
                    !this.toggles.some((el) => active.targetEl !== el && matches(el, ':focus'))
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

        transitionTo(newHeight, el) {
            const { dropbar } = this;
            const oldHeight = height(dropbar);

            el = oldHeight < newHeight && el;

            css(el, 'clipPath', `polygon(0 0,100% 0,100% ${oldHeight}px,0 ${oldHeight}px)`);

            height(dropbar, oldHeight);

            Transition.cancel([el, dropbar]);
            Promise.all([
                Transition.start(dropbar, { height: newHeight }, this.duration),
                Transition.start(
                    el,
                    {
                        clipPath: `polygon(0 0,100% 0,100% ${newHeight}px,0 ${newHeight}px)`,
                    },
                    this.duration
                ),
            ])
                .catch(noop)
                .then(() => css(el, { clipPath: '' }));
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
    const target = active.targetEl || current;
    const i = toggles.indexOf(target);

    // Left
    if (keyCode === keyMap.LEFT && i > 0) {
        active.hide?.(false);
        toggles[i - 1].focus();
    }

    // Right
    if (keyCode === keyMap.RIGHT && i < toggles.length - 1) {
        active.hide?.(false);
        toggles[i + 1].focus();
    }

    if (keyCode === keyMap.TAB) {
        target.focus();
        active.hide?.(false);
    }
}

function focusFirstFocusableElement(el) {
    if (!$(':focus', el)) {
        $(selFocusable, el)?.focus();
    }
}

const keyMap = {
    TAB: 9,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};
