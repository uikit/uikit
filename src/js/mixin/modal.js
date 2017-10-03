import UIkit from '../api/index';
import { $, doc, docElement, isWithin, promise, requestAnimationFrame, toJQuery, toMs, toNode, transitionend } from '../util/index';
import Class from './class';
import Togglable from './togglable';

var active;

export default {

    mixins: [Class, Togglable],

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
            return toNode(this.$props.container === true && UIkit.container || this.$props.container && toJQuery(this.$props.container));
        },

        transitionElement() {
            return this.panel;
        },

        transitionDuration() {
            return toMs(this.transitionElement.css('transition-duration'));
        },

        component() {
            return UIkit[this.$options.name];
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

            name: 'show',

            self: true,

            handler() {

                if (!docElement.hasClass(this.clsPage)) {
                    this.scrollbarWidth = window.innerWidth - docElement[0].offsetWidth;
                    this.body.css('overflow-y', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                docElement.addClass(this.clsPage);

            }

        },

        {

            name: 'hidden',

            self: true,

            handler() {
                if (this.component.active === this) {
                    if (this.stack) {
                        this.component.active = this.prev;
                    } else {
                        docElement.removeClass(this.clsPage);
                        this.body.css('overflow-y', '');
                        this.component.active = null;
                    }
                }
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

            if (this.container && !this.$el.parent().is(this.container)) {
                this.container.appendChild(this.$el[0]);
                return promise(resolve =>
                    requestAnimationFrame(() =>
                        resolve(this.show())
                    )
                )
            }

            var prev = active && active !== this && active;

            active = this;
            this.component.active = this;

            if (prev) {
                if (this.stack) {
                    this.prev = prev;
                } else {
                    prev.hide().then(this.show);
                    return;
                }
            } else {
                requestAnimationFrame(() => register(this.$options.name)); // TODO improve
            }

            return this.toggleNow(this.$el, true);
        },

        hide() {

            if (!this.isToggled()) {
                return;
            }

            active = active && active !== this && active || this.prev;

            if (!active) {
                deregister(this.$options.name);
            }

            return this.toggleNow(this.$el, false);
        },

        getActive() {
            return active;
        },

        _toggleImmediate(el, show) {

            requestAnimationFrame(() => this._toggle(el, show));

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
