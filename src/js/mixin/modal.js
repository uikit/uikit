import { $, doc, docElement, isWithin, promise, requestAnimationFrame, toJQuery, toMs, transitionend } from '../util/index';
import Class from './class';
import Toggable from './toggable';

var active;

export default {

    mixins: [Class, Toggable],

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

    ready() {

        this.body = $(document.body);
        this.panel = toJQuery(`.${this.clsPanel}`, this.$el);

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

            handler(e) {
                e.preventDefault();
                this.toggleNow(this.$el);
            }

        },

        {

            name: 'beforeshow',

            self: true,

            handler() {

                if (this.isActive()) {
                    return false;
                }

                var prev = active && active !== this && active;

                if (!active) {
                    this.body.css('overflow-y', this.getScrollbarWidth() && this.overlay ? 'scroll' : '');
                }

                active = this;

                if (prev) {
                    if (this.stack) {
                        this.prev = prev;
                    } else {
                        prev.hide();
                    }
                } else {
                    requestAnimationFrame(() => register(this.$options.name));
                }

                docElement.addClass(this.clsPage);

            }

        },

        {

            name: 'beforehide',

            self: true,

            handler() {

                if (!this.isActive()) {
                    return false;
                }

                active = active && active !== this && active || this.prev;

                if (!active) {
                    deregister(this.$options.name);
                }

                var duration = toMs(this.panel.css('transition-duration'));

                return duration ? promise(resolve => {
                        this.panel.one(transitionend, resolve);
                        setTimeout(() => {
                            resolve();
                            this.panel.off(transitionend, resolve);
                        }, duration);
                    }) : undefined;
            }

        },

        {

            name: 'hide',

            self: true,

            handler() {
                if (!active) {
                    docElement.removeClass(this.clsPage);
                    this.body.css('overflow-y', '');
                }
            }

        }

    ],

    methods: {

        isActive() {
            return this.$el.hasClass(this.cls);
        },

        toggle() {
            return this.isActive() ? this.hide() : this.show();
        },

        show() {
            return this.toggleNow(this.$el, true);
        },

        hide() {
            return this.toggleNow(this.$el, false);
        },

        getActive() {
            return active;
        },

        getScrollbarWidth() {
            var width = docElement[0].style.width;

            docElement.css('width', '');

            var scrollbarWidth = window.innerWidth - docElement.outerWidth(true);

            if (width) {
                docElement.width(width);
            }

            return scrollbarWidth;
        }
    }

}

function register(name) {
    doc.on({

        [`click.${name}`](e) {
            if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
                active.hide();
            }
        },

        [`keydown.${name}`](e) {
            if (e.keyCode === 27 && active && active.escClose) {
                e.preventDefault();
                active.hide();
            }
        }

    });
}

function deregister(name) {
    doc.off(`click.${name}`).off(`keydown.${name}`);
}
