import {Class} from '../mixin/index';
import {$, $$, includes, isInput, matches, query, selInput, toggleClass, trigger} from '../util/index';

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

            input(_, $el) {
                return $(selInput, $el);
            },

            state() {
                return this.input.nextElementSibling;
            },

            target({target}, $el) {
                return target && (target === true
                    && this.input.parentNode === $el
                    && this.input.nextElementSibling
                    || query(target, $el));
            }

        },

        update() {

            const {target, input} = this;

            if (!target) {
                return;
            }

            let option;

            target[isInput(target) ? 'value' : 'textContent'] = input.files && input.files[0]
                ? input.files[0].name
                : matches(input, 'select') && (option = $$('option', input).filter(el => el.selected)[0])
                    ? option.textContent
                    : input.value;

        },

        events: [

            {

                name: 'focusin focusout mouseenter mouseleave',

                delegate: selInput,

                handler({type, current}) {
                    if (current === this.input) {
                        toggleClass(
                            this.state,
                            `uk-${includes(type, 'focus') ? 'focus' : 'hover'}`,
                            includes(['focusin', 'mouseenter'], type)
                        );
                    }
                }

            },

            {

                name: 'change',

                handler() {
                    this.$emit();
                }

            }

        ]

    });

}
