import Class from '../mixin/class';
import {$, $$, includes, isInput, matches, query, selInput, toggleClass} from 'uikit-util';

export default {

    mixins: [Class],

    args: 'target',

    props: {
        target: Boolean
    },

    data: {
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
        const prop = isInput(target) ? 'value' : 'textContent';
        const prev = target[prop];
        const value = input.files && input.files[0]
            ? input.files[0].name
            : matches(input, 'select') && (option = $$('option', input).filter(el => el.selected)[0])
                ? option.textContent
                : input.value;

        if (prev !== value) {
            target[prop] = value;
        }

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

};
