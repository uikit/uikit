import fade from './internal/animate-fade';
import shift from './internal/animate-shift';
import {noop, toWindow, trigger} from 'uikit-util';

export default {

    props: {
        animation: Number,
        animationMode: String
    },

    data: {
        animation: 150,
        animationMode: 'shift'
    },

    methods: {

        animate(action, target = this.$el) {
            const animationFn = this.animationMode === 'fade' ? fade : shift;
            return animationFn(action, target, this.animation)
                .then(() => trigger(toWindow(target), 'resize'), noop);
        }
    }
};
