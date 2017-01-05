import { $, doc, isWithin, toJQuery, transitionend } from '../util/index';
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

        this.page = $(document.documentElement);
        this.body = $(document.body);
        this.panel = toJQuery(`.${this.clsPanel}`, this.$el);

        this.$el.on('click', this.selClose, e => {
            e.preventDefault();
            this.hide();
        });

    },

    events: {

        toggle(e) {
            e.preventDefault();
            this.toggleNow(this.$el);
        },

        beforeshow(e) {

            if (!this.$el.is(e.target)) {
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

        },

        show(e) {

            if (!this.$el.is(e.target)) {
                return;
            }

            if (!e.isShown) {
                e.stopImmediatePropagation();
            }

        },

        beforehide(e) {

            if (!this.$el.is(e.target)) {
                return;
            }

            active = active && active !== this && active || this.prev;

            this.panel.one(transitionend, () => {
                var event = $.Event('hide');
                event.isHidden = true;
                this.$el.trigger(event, [this]);
            });

        },

        hide(e) {

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

    },

    methods: {

        isActive() {
            return this.$el.hasClass(this.cls);
        },

        toggle() {
            return this.isActive() ? this.hide() : this.show();
        },

        show() {
            var deferred = $.Deferred();
            this.$el.one('show', () => deferred.resolve());
            this.toggleNow(this.$el, true);
            return deferred.promise();
        },

        hide() {
            var deferred = $.Deferred();
            this.$el.one('hide', () => deferred.resolve());
            this.toggleNow(this.$el, false);
            return deferred.promise();
        },

        getActive() {
            return active;
        },

        getScrollbarWidth() {
            var width = this.page[0].style.width;

            this.page.css('width', '');

            var scrollbarWidth = window.innerWidth - this.page.width();

            if (width) {
                this.page.width(width);
            }

            return scrollbarWidth;
        }
    }

}
