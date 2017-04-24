import UIkit from '../api/index';
import { $, doc, docElement, isWithin, promise, requestAnimationFrame, toNode, toJQuery, toMs, transitionend } from '../util/index';
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
        stack: Boolean,
        container: Boolean
    },

    defaults: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false,
        container: true
    },

    computed: {

        body() {
            return $(document.body);
        },

        panel() {
            return this.$el.find(`.${this.clsPanel}`);
        },

        container() {
            var container = this.$props.container === true && UIkit.container || this.$props.container && toJQuery(this.$props.container);
            return container && toNode(container);
        },

        transitionElement() {
            return this.panel;
        },

        transitionDuration() {
            return toMs(this.transitionElement.css('transition-duration'));
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

            handler(e) {
                e.preventDefault();
                this.toggle();
            }

        },

        {

            name: 'beforeshow',

            self: true,

            handler() {

                if (this.isToggled()) {
                    return false;
                }

                var prev = active && active !== this && active;

                active = this;

                if (prev) {
                    if (this.stack) {
                        this.prev = prev;
                    } else {
                        prev.hide().then(this.show);
                        return false;
                    }
                } else {
                    requestAnimationFrame(() => register(this.$options.name));
                }

                if (!prev) {
                    this.scrollbarWidth = window.innerWidth - docElement[0].offsetWidth;
                    this.body.css('overflow-y', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                docElement.addClass(this.clsPage);

            }

        },

        {

            name: 'beforehide',

            self: true,

            handler() {

                if (!this.isToggled()) {
                    return false;
                }

                active = active && active !== this && active || this.prev;

                if (!active) {
                    deregister(this.$options.name);
                }

            }

        },

        {

            name: 'hidden',

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

        toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show() {
            if (this.container && !this.$el.parent().is(this.container)) {
                this.container.appendChild(this.$el[0]);
                return promise(resolve =>
                    requestAnimationFrame(() =>
                        resolve(this.show())
                    )
                )
            }

            return this.toggleNow(this.$el, true);
        },

        hide() {
            return this.toggleNow(this.$el, false);
        },

        getActive() {
            return active;
        },

        _toggleImmediate(el, show) {
            this._toggle(el, show);

            return this.transitionDuration ? promise((resolve, reject) => {

                if (this._transition) {
                    this.transitionElement.off(transitionend, this._transition.handler);
                    this._transition.reject();
                }

                this._transition = {
                    reject,
                    handler: () => {
                        resolve();
                        this._transition = null;
                    }
                };

                this.transitionElement.one(transitionend, this._transition.handler);

            }) : promise.resolve();
        },
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
