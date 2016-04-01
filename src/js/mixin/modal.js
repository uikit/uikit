import $ from 'jquery';
import {isWithin, toJQuery} from '../util/index';

export default function (UIkit) {

    var active = false;

    $(document).on('click', e => {
        if (active && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
            active.hide();
        }
    });

    UIkit.mixin.modal = {

        mixins: [UIkit.mixin.toggable],

        props: {
            clsPanel: String,
            clsClose: String
        },

        defaults: {
            cls: 'uk-open'
        },

        ready() {

            this.page = $('html');
            this.body = $('body');
            this.panel = toJQuery(`.${this.clsPanel}`, this.$el);

            this.$el.on('click', `.${this.clsClose}`, (e) => {
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

                if (hide) {
                    hide.hide();
                }

            },

            beforehide() {

                if (!this.isActive()) {
                    return;
                }

                active = active && active !== this && active;

            }

        },

        methods: {

            isActive() {
                return this.$el.hasClass(this.cls);
            },

            show() {
                this.toggleNow(this.$el, true);
            },

            hide() {
                this.toggleNow(this.$el, false);
            },

            getActive() {
                return active;
            }
        }

    };

}
