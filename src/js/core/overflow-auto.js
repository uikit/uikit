import Class from '../mixin/class';
import {closest, css, height, trigger} from 'uikit-util';

export default {

    mixins: [Class],

    computed: {

        modal(_, $el) {
            return closest($el, '.uk-modal');
        },

        panel(_, $el) {
            return closest($el, '.uk-modal-dialog');
        }

    },

    connected() {
        css(this.$el, 'minHeight', 150);
    },

    update: {

        write() {

            if (!this.panel || !this.modal) {
                return;
            }

            const current = css(this.$el, 'maxHeight');

            css(css(this.$el, 'maxHeight', 150), 'maxHeight', Math.max(150, 150 + height(this.modal) - this.panel.offsetHeight));
            if (current !== css(this.$el, 'maxHeight')) {
                trigger(this.$el, 'resize');
            }
        },

        events: ['load', 'resize']

    }

};
