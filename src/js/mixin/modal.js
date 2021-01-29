import {$, addClass, append, css, includes, last, on, once, parent, pointerCancel, pointerDown, pointerUp, Promise, removeClass, toFloat, toMs, width, within} from 'uikit-util';
import Class from './class';
import Container from './container';
import Togglable from './togglable';

const active = [];

export default {

    mixins: [Class, Container, Togglable],

    props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean
    },

    data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false
    },

    computed: {

        panel({selPanel}, $el) {
            return $(selPanel, $el);
        },

        transitionElement() {
            return this.panel;
        },

        bgClose({bgClose}) {
            return bgClose && this.panel;
        }

    },

    beforeDisconnect() {
        if (this.isToggled()) {
            this.toggleElement(this.$el, false, false);
        }
    },

    events: [

        {

            name: 'click',

            delegate() {
                return this.selClose;
            },

            handler(e) {
                e.preventDefault();
                this.hide();
            }

        },

        {

            name: 'toggle',

            self: true,

            handler(e) {

                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();

                if (this.isToggled() === includes(active, this)) {
                    this.toggle();
                }
            }

        },

        {
            name: 'beforeshow',

            self: true,

            handler(e) {

                if (includes(active, this)) {
                    return false;
                }

                if (!this.stack && active.length) {
                    Promise.all(active.map(modal => modal.hide())).then(this.show);
                    e.preventDefault();
                } else {
                    active.push(this);
                }
            }

        },

        {

            name: 'show',

            self: true,

            handler() {

                if (width(window) - width(document) && this.overlay) {
                    css(document.body, 'overflowY', 'scroll');
                }

                if (this.stack) {
                    css(this.$el, 'zIndex', toFloat(css(this.$el, 'zIndex')) + active.length);
                }

                addClass(document.documentElement, this.clsPage);

                if (this.bgClose) {
                    once(this.$el, 'hide', on(document, pointerDown, ({target}) => {

                        if (last(active) !== this || this.overlay && !within(target, this.$el) || within(target, this.panel)) {
                            return;
                        }

                        once(document, `${pointerUp} ${pointerCancel} scroll`, ({defaultPrevented, type, target: newTarget}) => {
                            if (!defaultPrevented && type === pointerUp && target === newTarget) {
                                this.hide();
                            }
                        }, true);

                    }), {self: true});
                }

                if (this.escClose) {
                    once(this.$el, 'hide', on(document, 'keydown', e => {
                        if (e.keyCode === 27 && last(active) === this) {
                            this.hide();
                        }
                    }), {self: true});
                }
            }

        },

        {

            name: 'hidden',

            self: true,

            handler() {

                if (includes(active, this)) {
                    active.splice(active.indexOf(this), 1);
                }

                if (!active.length) {
                    css(document.body, 'overflowY', '');
                }

                css(this.$el, 'zIndex', '');

                if (!active.some(modal => modal.clsPage === this.clsPage)) {
                    removeClass(document.documentElement, this.clsPage);
                }

            }

        }

    ],

    methods: {

        toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show() {
            if (this.container && parent(this.$el) !== this.container) {
                append(this.container, this.$el);
                return new Promise(resolve =>
                    requestAnimationFrame(() =>
                        this.show().then(resolve)
                    )
                );
            }

            return this.toggleElement(this.$el, true, animate(this));
        },

        hide() {
            return this.toggleElement(this.$el, false, animate(this));
        }

    }

};

function animate({transitionElement, _toggle}) {
    return (el, show) =>
        new Promise((resolve, reject) =>
            once(el, 'show hide', () => {
                el._reject && el._reject();
                el._reject = reject;

                _toggle(el, show);

                const off = once(transitionElement, 'transitionstart', () => {
                    once(transitionElement, 'transitionend transitioncancel', resolve, {self: true});
                    clearTimeout(timer);
                }, {self: true});

                const timer = setTimeout(() => {
                    off();
                    resolve();
                }, toMs(css(transitionElement, 'transitionDuration')));

            })
        ).then(() => delete el._reject);
}
