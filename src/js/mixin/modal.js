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

        methods: {

            isActive() {
                return this.$el.hasClass(this.cls);
            },

            doToggle() {
                this[this.isActive() ? 'hide' : 'show']();
            },

            show() {

                if (this.isActive()) {
                    return;
                }

                var hide = active && active !== this && active;

                active = this;

                if (hide) {
                    hide.hide();
                }

                this.toggleElement(this.$el, false, true);
            },

            hide() {

                if (!this.isActive()) {
                    return;
                }

                active = active && active !== this && active;

                this.toggleElement(this.$el, false, false);
            },

            getActive() {
                return active;
            }

        }

    };

}
