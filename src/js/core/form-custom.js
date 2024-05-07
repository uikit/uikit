import { $, $$, isInput, matches, parent, selInput } from 'uikit-util';
import Class from '../mixin/class';

export default {
    mixins: [Class],

    args: 'target',

    props: {
        target: Boolean,
    },

    data: {
        target: false,
    },

    computed: {
        input: (_, $el) => $(selInput, $el),

        state() {
            return this.input.nextElementSibling;
        },

        target({ target }, $el) {
            return (
                target &&
                ((target === true && parent(this.input) === $el && this.input.nextElementSibling) ||
                    $(target, $el))
            );
        },
    },

    update() {
        const { target, input } = this;

        if (!target) {
            return;
        }

        let option;
        const prop = isInput(target) ? 'value' : 'textContent';
        const prev = target[prop];
        const value = input.files?.[0]
            ? input.files[0].name
            : matches(input, 'select') &&
                (option = $$('option', input).filter((el) => el.selected)[0])
              ? option.textContent
              : input.value;

        if (prev !== value) {
            target[prop] = value;
        }
    },

    events: [
        {
            name: 'change',

            handler() {
                this.$emit();
            },
        },

        {
            name: 'reset',

            el: ({ $el }) => $el.closest('form'),

            handler() {
                this.$emit();
            },
        },
    ],
};
