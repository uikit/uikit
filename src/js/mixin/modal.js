import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    $(document).on({
        click: e => {
            if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
                active.hide();
            }
        },
        keydown: e => {
            if (e.keyCode === 27 && active && active.escClose) {
                e.preventDefault();
                active.hide();
            }
        }
    });

    UIkit.mixin.modal = {

        mixins: [UIkit.mixin.toggable],

        props: {
            clsPanel: String,
            selClose: String,
            escClose: Boolean,
            bgClose: Boolean
        },

        defaults: {
            cls: 'uk-open',
            escClose: true,
            bgClose: true,
            overlay: true
        },

        ready() {

            this.page = $('html');
            this.body = $('body');
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

            beforeshow() {

                if (this.isActive()) {
                    return false;
                }

                var hide = active && active !== this && active;

                active = this;

                if (this.getScrollbarWidth() && this.overlay) {
                    this.body.css('overflow-y', 'scroll');
                }

                if (hide) {
                    hide.hide();
                }

                this.$el.one(transitionend, () => {
                    var event = $.Event('show');
                    event.isShown = true;
                    this.$el.trigger(event, [this]);
                });

            },

            show(e) {
                if (!e.isShown) {
                    e.stopImmediatePropagation();
                }
            },

            beforehide() {
                active = active && active !== this && active;

                this.$el.one(transitionend, () => {
                    var event = $.Event('hide');
                    event.isHidden = true;
                    this.$el.trigger(event, [this]);
                });
            },

            hide(e) {

                if (!e.isHidden) {
                    e.stopImmediatePropagation();
                    return;
                }

                this.body.css('overflow-y', '');

            }

        },

        methods: {

            isActive() {
                return this.$el.hasClass(this.cls);
            },

            toggle() {
                return this.toggleNow(this.$el);
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
                return window.innerWidth - this.page.width();
            }
        }

    };

}
