import {
    $,
    addClass,
    append,
    css,
    endsWith,
    includes,
    isFocusable,
    isSameSiteAnchor,
    last,
    matches,
    on,
    once,
    parent,
    pointerCancel,
    pointerDown,
    pointerUp,
    removeClass,
    toFloat,
} from 'uikit-util';
import { awaitFrame } from '../util/await';
import { preventBackgroundScroll } from '../util/scroll';
import Class from './class';
import Container from './container';
import { maybeDefaultPreventClick } from './event';
import { storeScrollPosition } from './position';
import Togglable from './togglable';

const active = [];

export default {
    mixins: [Class, Container, Togglable],

    props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean,
        role: String,
    },

    data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false,
        role: 'dialog',
    },

    computed: {
        panel: ({ selPanel }, $el) => $(selPanel, $el),

        transitionElement() {
            return this.panel;
        },
    },

    connected() {
        const el = this.panel || this.$el;
        el.role = this.role;

        if (this.overlay) {
            el.ariaModal = true;
        }
    },

    beforeDisconnect() {
        if (includes(active, this)) {
            this.toggleElement(this.$el, false, false);
        }
    },

    events: [
        {
            name: 'click',

            delegate: ({ selClose }) => `${selClose},a[href*="#"]`,

            handler(e) {
                const { current, defaultPrevented } = e;
                const { hash } = current;
                if (
                    !defaultPrevented &&
                    hash &&
                    isSameSiteAnchor(current) &&
                    !this.$el.contains($(hash))
                ) {
                    this.hide();
                } else if (matches(current, this.selClose)) {
                    maybeDefaultPreventClick(e);
                    this.hide();
                }
            },
        },

        {
            name: 'toggle',

            self: true,

            handler(e, toggle) {
                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();

                this.target = toggle?.$el;
                if (this.isToggled() === includes(active, this)) {
                    this.toggle();
                }
            },
        },

        {
            name: 'beforeshow',

            self: true,

            handler(e) {
                if (includes(active, this)) {
                    return false;
                }

                if (!this.stack && active.length) {
                    Promise.all(active.map((modal) => modal.hide())).then(this.show);
                    e.preventDefault();
                } else {
                    active.push(this);
                }
            },
        },

        {
            name: 'show',

            self: true,

            handler() {
                if (this.stack) {
                    css(this.$el, 'zIndex', toFloat(css(this.$el, 'zIndex')) + active.length);
                }

                const handlers = [
                    this.overlay && preventBackgroundFocus(this),
                    this.overlay && preventBackgroundScroll(this.$el),
                    this.bgClose && listenForBackgroundClose(this),
                    this.escClose && listenForEscClose(this),
                ];

                once(
                    this.$el,
                    'hidden',
                    () => handlers.forEach((handler) => handler && handler()),
                    { self: true },
                );

                addClass(document.documentElement, this.clsPage);

                setAriaExpanded(this.target, true);
            },
        },

        {
            name: 'shown',

            self: true,

            handler() {
                if (!isFocusable(this.$el)) {
                    this.$el.tabIndex = -1;
                }

                if (!matches(this.$el, ':focus-within')) {
                    this.$el.focus();
                }
            },
        },

        {
            name: 'hidden',

            self: true,

            handler() {
                if (includes(active, this)) {
                    active.splice(active.indexOf(this), 1);
                }

                css(this.$el, 'zIndex', '');

                const { target } = this;
                if (!active.some((modal) => modal.clsPage === this.clsPage)) {
                    removeClass(document.documentElement, this.clsPage);

                    queueMicrotask(() => {
                        if (isFocusable(target)) {
                            const restoreScrollPosition = storeScrollPosition(target);
                            target.focus();
                            restoreScrollPosition();
                        }
                    });
                }

                setAriaExpanded(target, false);

                this.target = null;
            },
        },
    ],

    methods: {
        toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        async show() {
            if (this.container && parent(this.$el) !== this.container) {
                append(this.container, this.$el);
                await awaitFrame();
            }

            return this.toggleElement(this.$el, true, animate);
        },

        hide() {
            return this.toggleElement(this.$el, false, animate);
        },
    },
};

function animate(el, show, { transitionElement, _toggle }) {
    return new Promise((resolve, reject) =>
        once(el, 'show hide', () => {
            el._reject?.();
            el._reject = reject;

            _toggle(el, show);

            const off = once(
                transitionElement,
                'transitionstart',
                () => {
                    once(transitionElement, 'transitionend transitioncancel', resolve, {
                        self: true,
                    });
                    clearTimeout(timer);
                },
                { self: true },
            );

            const timer = setTimeout(
                () => {
                    off();
                    resolve();
                },
                toMs(css(transitionElement, 'transitionDuration')),
            );
        }),
    ).then(() => delete el._reject);
}

function toMs(time) {
    return time ? (endsWith(time, 'ms') ? toFloat(time) : toFloat(time) * 1000) : 0;
}

function preventBackgroundFocus(modal) {
    return on(document, 'focusin', (e) => {
        if (last(active) === modal && !modal.$el.contains(e.target)) {
            modal.$el.focus();
        }
    });
}

function listenForBackgroundClose(modal) {
    return on(document, pointerDown, ({ target }) => {
        if (
            last(active) !== modal ||
            (modal.overlay && !modal.$el.contains(target)) ||
            !modal.panel ||
            modal.panel.contains(target)
        ) {
            return;
        }

        once(
            document,
            `${pointerUp} ${pointerCancel} scroll`,
            ({ defaultPrevented, type, target: newTarget }) => {
                if (!defaultPrevented && type === pointerUp && target === newTarget) {
                    modal.hide();
                }
            },
            true,
        );
    });
}

function listenForEscClose(modal) {
    return on(document, 'keydown', (e) => {
        if (e.keyCode === 27 && last(active) === modal) {
            modal.hide();
        }
    });
}

function setAriaExpanded(el, toggled) {
    if (el?.ariaExpanded) {
        el.ariaExpanded = toggled;
    }
}
