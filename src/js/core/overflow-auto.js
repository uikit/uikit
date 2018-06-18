import Class from '../mixin/class';
import {closest, css, height, toFloat, trigger} from 'uikit-util';

export default {

    mixins: [Class],

    props: {
        selModal: String,
        selPanel: String,
    },

    data: {
        selModal: '.uk-modal',
        selPanel: '.uk-modal-dialog',
    },

    computed: {

        modal({selModal}, $el) {
            return closest($el, selModal);
        },

        panel({selPanel}, $el) {
            return closest($el, selPanel);
        }

    },

    connected() {
        css(this.$el, 'minHeight', 150);
    },

    update: {

        read() {

            if (!this.panel || !this.modal) {
                return false;
            }

            return {
                current: toFloat(css(this.$el, 'maxHeight')),
                max: Math.max(150, height(this.modal) - (this.panel.offsetHeight - height(this.$el)))
            }
        },

        write({current, max}) {
            css(this.$el, 'maxHeight', max);
            if (current !== max) {
                trigger(this.$el, 'resize');
            }
        },

        events: ['load', 'resize']

    }

};
