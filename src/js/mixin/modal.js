import {$, addClass, append, css, doc, docEl, hasClass, on, once, Promise, removeClass, toMs, width, win, within} from '../util/index';
import Class from './class';
import Container from './container';
import Togglable from './togglable';

let active;

export default {

    mixins: [Class, Container, Togglable],

    props: {
        clsPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean
    },

    defaults: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false
    },

    computed: {

        panel({clsPanel}, $el) {
            return $(`.${clsPanel}`, $el);
        },

        transitionElement() {
            return this.panel;
        },

        transitionDuration() {
            return toMs(css(this.transitionElement, 'transitionDuration'));
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

                if (!hasClass(docEl, this.clsPage)) {
                    this.scrollbarWidth = width(win) - docEl.offsetWidth;
                    css(doc.body, 'overflowY', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                addClass(docEl, this.clsPage);

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
                    removeClass(docEl, this.clsPage);

                }

                !this.prev && css(doc.body, 'overflowY', '');
            }

        }

    ],

    methods: {

        toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show() {

            if (this.isToggled()) {
                return;
            }

            if (this.container && this.$el.parentNode !== this.container) {
                append(this.container, this.$el);
                this._callConnected();
            }

            return this.toggleNow(this.$el, true);
        },

        hide() {
            if (this.isToggled()) {
                return this.toggleNow(this.$el, false);
            }
        },

        getActive() {
            return active;
        },

        _toggleImmediate(el, show) {
            return new Promise(resolve =>
                requestAnimationFrame(() => {
                    this._toggle(el, show);

                    if (this.transitionDuration) {
                        once(this.transitionElement, 'transitionend', resolve, false, e => e.target === this.transitionElement);
                    } else {
                        resolve();
                    }
                })
            );
        }

    }

};

let events;

function registerEvents() {

    if (events) {
        return;
    }

    events = [
        on(docEl, 'click', ({target, defaultPrevented}) => {
            if (active && active.bgClose && !defaultPrevented && !within(target, (active.panel || active.$el))) {
                active.hide();
            }
        }),
        on(doc, 'keydown', e => {
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
