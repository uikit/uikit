import { Class } from '../mixin/index';
import { query } from '../util/index';

export default function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        props: {
            target: Boolean
        },

        defaults: {
            target: false
        },

        ready() {
            this.input = this.$el.find(':input:first');
            this.target = this.target && query(this.target === true ? '> :input:first + :first' : this.target, this.$el);

            var state = this.input.next();
            this.input.on({
                focus: e => state.addClass('uk-focus'),
                blur: e => state.removeClass('uk-focus'),
                mouseenter: e => state.addClass('uk-hover'),
                mouseleave: e => state.removeClass('uk-hover')
            });

            this.input.trigger('change');
        },

        events: {

            change() {
                this.target && this.target[this.target.is(':input') ? 'val' : 'text'](
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
