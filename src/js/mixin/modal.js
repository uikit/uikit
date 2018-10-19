import {$, addClass, append, css, hasClass, on, once, Promise, removeClass, toMs, width, within} from 'uikit-util';
import Class from './class';
import Container from './container';
import Togglable from './togglable';

let active;

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
            this.toggleNow(this.$el, false);
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
                this.toggle();
            }

        },

        {
            name: 'beforeshow',

            self: true,

            handler(e) {

                const prev = active && active !== this && active;

                active = this;

                if (prev) {
                    if (this.stack) {
                        this.prev = prev;
                    } else {
                        prev.hide().then(this.show);
                        e.preventDefault();
                        return;
                    }
                }

                registerEvents();

            }

        },

        {
            name: 'beforehide',

            self: true,

            handler() {

                active = active && active !== this && active || this.prev;

                if (!active) {
                    deregisterEvents();
                }

            }

        },

        {

            name: 'show',

            self: true,

            handler() {

                if (!hasClass(document.documentElement, this.clsPage)) {
                    this.scrollbarWidth = width(window) - width(document);
                    css(document.body, 'overflowY', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                addClass(document.documentElement, this.clsPage);

            }

        },

        {

            name: 'hidden',

            self: true,

            handler() {

                let found, {prev} = this;

                while (prev) {

                    if (prev.clsPage === this.clsPage) {
                        found = true;
                        break;
                    }

                    prev = prev.prev;

                }

                if (!found) {
                    removeClass(document.documentElement, this.clsPage);

                }

                !this.prev && css(document.body, 'overflowY', '');
            }

        }

    ],

    methods: {

        toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show() {

            if (this.isToggled()) {
                return Promise.resolve();
            }

            if (this.container && this.$el.parentNode !== this.container) {
                append(this.container, this.$el);
                this._callConnected();
            }

            return this.toggleElement(this.$el, true, animate(this));
        },

        hide() {
            return this.isToggled()
                ? this.toggleElement(this.$el, false, animate(this))
                : Promise.resolve();
        },

        getActive() {
            return active;
        }

    }

};

let events;

function registerEvents() {

    if (events) {
        return;
    }

    events = [
        on(document, 'click', ({target, defaultPrevented}) => {
            if (active && active.bgClose && !defaultPrevented && (!active.overlay || within(target, active.$el)) && !within(target, active.panel)) {
                active.hide();
            }
        }),
        on(document, 'keydown', e => {
            if (e.keyCode === 27 && active && active.escClose) {
                e.preventDefault();
                active.hide();
            }
        })
    ];
}

function deregisterEvents() {
    events && events.forEach(unbind => unbind());
    events = null;
}

function animate({transitionElement, _toggle}) {
    return (el, show) =>
        new Promise(resolve =>
            requestAnimationFrame(() => {

                _toggle(el, show);

                if (toMs(css(transitionElement, 'transitionDuration'))) {
                    once(transitionElement, 'transitionend', resolve, false, e => e.target === transitionElement);
                } else {
                    resolve();
                }
            })
        );
}
