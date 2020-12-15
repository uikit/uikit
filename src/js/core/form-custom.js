import Class from '../mixin/class';
import {$, $$, closest, isInput, matches, parent, query, selInput} from 'uikit-util';

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
                && parent(this.input) === $el
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
            : matches(input, 'select') && (option = $$('option', input).filter(el => el.selected)[0]) // eslint-disable-line prefer-destructuring
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
                this.$update();
            }
        },

        {
            name: 'reset',

            el() {
                return closest(this.$el, 'form');
            },

            handler() {
                this.$update();
            }
        }

    ]

};
