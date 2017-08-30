import { Class } from '../mixin/index';
import { query, trigger } from '../util/index';

export default function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        args: 'target',

        props: {
            target: Boolean
        },

        defaults: {
            target: false
        },

        computed: {

            input() {
                return this.$el.find(':input:first');
            },

            state() {
                return this.input.next();
            },

            target() {
                return this.$props.target && query(this.$props.target === true ? '> :input:first + :first' : this.$props.target, this.$el)
            }

        },

        connected() {
            trigger(this.input, 'change');
        },

        events: [

            {

                name: 'focusin focusout mouseenter mouseleave',

                delegate: ':input:first',

                handler({type}) {
                    this.$toggleClass(this.state, `uk-${~type.indexOf('focus') ? 'focus' : 'hover'}`, ~['focusin', 'mouseenter'].indexOf(type));
                }

            },

            {

                name: 'change',

                handler() {
                    this.target && this.target[this.target.is(':input') ? 'val' : 'text'](
                        this.input[0].files && this.input[0].files[0]
                            ? this.input[0].files[0].name
                            : this.input.is('select')
                                ? this.input.find('option:selected').text()
                                : this.input[0].value
                    );
                }

            }

        ]

    });

}
