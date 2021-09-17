import Class from '../mixin/class';
import {closest, css, dimensions, height, isVisible, toFloat, trigger} from 'uikit-util';

export default {

    mixins: [Class],

    props: {
        selContainer: String,
        selContent: String,
        minHeight: Number
    },

    data: {
        selContainer: '.uk-modal',
        selContent: '.uk-modal-dialog',
        minHeight: 150
    },

    computed: {

        container({selContainer}, $el) {
            return closest($el, selContainer);
        },

        content({selContent}, $el) {
            return closest($el, selContent);
        }

    },

    connected() {
        css(this.$el, 'minHeight', this.minHeight);
    },

    update: {

        read() {

            if (!this.content || !this.container || !isVisible(this.$el)) {
                return false;
            }

            return {
                current: toFloat(css(this.$el, 'maxHeight')),
                max: Math.max(this.minHeight, height(this.container) - (dimensions(this.content).height - height(this.$el)))
            };
        },

        write({current, max}) {
            css(this.$el, 'maxHeight', max);
            if (Math.round(current) !== Math.round(max)) {
                trigger(this.$el, 'resize');
            }
        },

        events: ['resize']

    }

};
