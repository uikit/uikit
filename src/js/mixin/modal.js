import { $, doc, docElement, isWithin, promise, toJQuery, transitionend } from '../util/index';
import Class from './class';
import Toggable from './toggable';

var active;

doc.on({

    click(e) {
        if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
            active.hide();
        }
    },

    keydown(e) {
        if (e.keyCode === 27 && active && active.escClose) {
            e.preventDefault();
            active.hide();
        }
    }

});

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

            handler({target}) {

                if (!this.$el.is(target)) {
                    return;
                }

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
                }

                this.panel.one(transitionend, () => {
                    var event = $.Event('show');
                    event.isShown = true;
                    this.$el.trigger(event, [this]);
                });
            }

        },

        {

            name: 'show',

            handler(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                if (!e.isShown) {
                    e.stopImmediatePropagation();
                }
            }

        },

        {

            name: 'beforehide',

            handler(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                active = active && active !== this && active || this.prev;

                var hide = () => {
                    var event = $.Event('hide');
                    event.isHidden = true;
                    this.$el.trigger(event, [this]);
                };

                if (parseFloat(this.panel.css('transition-duration'))) {
                    this.panel.one(transitionend, hide);
                } else {
                    hide();
                }
            }

        },

        {

            name: 'hide',

            handler(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                if (!e.isHidden) {
                    e.stopImmediatePropagation();
                    return;
                }

                if (!active) {
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
            return promise(resolve => {
                this.$el.one('show', resolve);
                this.toggleNow(this.$el, true);
            });
        },

        hide() {
            return promise(resolve => {
                this.$el.one('hide', resolve);
                this.toggleNow(this.$el, false);
            });
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
