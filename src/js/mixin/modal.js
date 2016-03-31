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

        props: {
            clsPanel: String,
            clsOpen: String,
            clsClose: String
        },

        defaults: {
            clsOpen: 'uk-open'
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

        methods: {

            isActive() {
                return this.$el.hasClass(this.clsOpen);
            },

            doToggle() {
                this[this.isActive() ? 'hide' : 'show']();
            },

            show() {

                if (this.isActive()) {
                    return;
                }

                var hide = false;

                if (active && active !== this) {
                    hide = true;
                }

                active = this;

                if (hide) {
                    active.hide();
                }

                this.$el.trigger('beforeshow', [this]);
                this.$el.trigger('show', [this]);

                this.$update();
            },

            hide() {

                if (!this.isActive()) {
                    return;
                }

                active = false;

                this.$el.trigger('beforehide', [this]);
                this.$el.trigger('hide', [this]);

                this.$update();
            },

            getActive() {
                return active;
            }

        }

    };

}
