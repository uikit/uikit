import UIkit from '../api/index';
import { $, addClass, css, doc, docEl, hasClass, on, one, promise, removeClass, requestAnimationFrame, toJQuery, toMs, toNode, transitionend, width, win, within } from '../util/index';
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
            return $(doc.body);
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
            return toMs(css(this.transitionElement, 'transitionDuration'));
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

                if (!hasClass(docEl, this.clsPage)) {
                    this.scrollbarWidth = width(win) - docEl.offsetWidth;
                    css(this.body, 'overflowY', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                addClass(docEl, this.clsPage);

            }

        },

        {

            name: 'hidden',

            self: true,

            handler() {
                if (this.component.active === this) {
                    removeClass(docEl, this.clsPage);
                    css(this.body, 'overflowY', '');
                    this.component.active = null;
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
                    this._transition.unbind();
                    this._transition.reject();
                }

                this._transition = {
                    reject,
                    unbind: one(this.transitionElement, transitionend, () => {
                        resolve();
                        this._transition = null;
                    })
                };

            }) : promise.resolve();

        },
    }

}

var events = {};

function register(name) {
    events[name] = [
        on(doc, 'click', ({target, defaultPrevented}) => {
            if (active && active.bgClose && !defaultPrevented && !within(target, active.panel)) {
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

function deregister(name) {
    events[name].forEach(unbind => unbind());
    delete events[name];
}
