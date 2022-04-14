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
    isVisible,
    matches,
    noop,
    offset,
    once,
    parent,
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
        mode: 'list',
        align: String,
        offset: Number,
        boundary: Boolean,
        boundaryAlign: Boolean,
        clsDrop: String,
        delayShow: Number,
        delayHide: Number,
        dropbar: Boolean,
        dropbarAnchor: Boolean,
        duration: Number,
    },

    data: {
        dropdown: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
        align: isRtl ? 'right' : 'left',
        clsDrop: 'uk-navbar-dropdown',
        mode: undefined,
        offset: undefined,
        delayShow: undefined,
        delayHide: undefined,
        boundaryAlign: undefined,
        flip: 'x',
        boundary: true,
        dropbar: false,
        dropbarAnchor: false,
        duration: 200,
        container: false,
    },

    computed: {
        boundary({ boundary }, $el) {
            return boundary === true ? $el : boundary;
        },

        dropbarAnchor({ dropbarAnchor }, $el) {
            return query(dropbarAnchor, $el);
        },

        pos({ align }) {
            return `bottom-${align}`;
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
                addClass(dropbar, 'uk-navbar-dropbar');
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
                        const target = this.getDropdown(el)?.target;
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
                        boundary: this.boundary,
                        pos: this.pos,
                        offset: this.dropbar || this.offset,
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
                    active.target &&
                    !within(active.target, current) &&
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

                    if (!active || active.target !== current) {
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
                    active?.target?.focus();
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

            handler(_, { $el }) {
                if (!hasClass($el, this.clsDrop)) {
                    return;
                }

                if (!parent(this.dropbar)) {
                    after(this.dropbarAnchor || this.$el, this.dropbar);
                }

                addClass($el, `${this.clsDrop}-dropbar`);
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

            handler(_, { $el, pos: [dir] = [] }) {
                if (!hasClass($el, this.clsDrop)) {
                    return;
                }

                if (dir === 'bottom') {
                    this.transitionTo(
                        offset($el).bottom -
                            offset(this.dropbar).top +
                            toFloat(css($el, 'marginBottom')),
                        $el
                    );
                }
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

            handler(e, { $el }) {
                const active = this.getActive();

                if (
                    matches(this.dropbar, ':hover') &&
                    active?.$el === $el &&
                    !this.toggles.some((el) => active.target !== el && matches(el, ':focus'))
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

            handler(_, { $el }) {
                if (!hasClass($el, this.clsDrop)) {
                    return;
                }

                const active = this.getActive();

                if (!active || active?.$el === $el) {
                    this.transitionTo(0);
                }
            },
        },
    ],

    methods: {
        getActive() {
            return active && within(active.target, this.$el) && active;
        },

        transitionTo(newHeight, el) {
            const { dropbar } = this;
            const oldHeight = isVisible(dropbar) ? height(dropbar) : 0;

            el = oldHeight < newHeight && el;

            css(el, 'clip', `rect(0,${el.offsetWidth}px,${oldHeight}px,0)`);

            height(dropbar, oldHeight);

            Transition.cancel([el, dropbar]);
            return Promise.all([
                Transition.start(dropbar, { height: newHeight }, this.duration),
                Transition.start(
                    el,
                    { clip: `rect(0,${el.offsetWidth}px,${newHeight}px,0)` },
                    this.duration
                ),
            ])
                .catch(noop)
                .then(() => {
                    css(el, { clip: '' });
                    this.$update(dropbar);
                });
        },

        getDropdown(el) {
            return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        },
    },
};

function handleNavItemNavigation(e, toggles, active) {
    const { current, keyCode } = e;
    const target = active?.target || current;
    const i = toggles.indexOf(target);

    // Left
    if (keyCode === keyMap.LEFT && i > 0) {
        active?.hide(false);
        toggles[i - 1].focus();
    }

    // Right
    if (keyCode === keyMap.RIGHT && i < toggles.length - 1) {
        active?.hide(false);
        toggles[i + 1].focus();
    }

    if (keyCode === keyMap.TAB) {
        target.focus();
        active?.hide(false);
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
