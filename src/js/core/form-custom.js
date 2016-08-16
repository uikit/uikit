import { Class } from '../mixin/index';
import { toJQuery } from '../util/index';

export default function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        props: {
            target: String
        },

        defaults: {
            target: false
        },

        ready() {
            this.input = this.$el.find(':input:first');
            this.target = this.target && toJQuery(this.$el.find(this.target)) || this.input.next();

            this.input.on({
                focus: e => this.target.addClass('uk-focus'),
                blur: e => this.target.removeClass('uk-focus'),
                mouseenter: e => this.target.addClass('uk-hover'),
                mouseleave: e => this.target.removeClass('uk-hover')
            });

            this.input.trigger('change');
        },

        events: {

            change(e) {
                this.target[this.target.is(':input') ? 'val' : 'text'](
                    this.input[0].files && this.input[0].files[0]
                        ? this.input[0].files[0].name
                        : this.input.is('select')
                            ? this.input.find('option:selected').text()
                            : this.input.val()
                );
            }

        }

    });

}
