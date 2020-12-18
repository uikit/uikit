import fade from './internal/animate-fade';
import slide from './internal/animate-slide';
import {noop, toWindow, trigger} from 'uikit-util';

export default {

    props: {
        duration: Number,
        animation: String
    },

    data: {
        duration: 150,
        animation: 'slide'
    },

    methods: {

        animate(action, target = this.$el) {
            const animationFn = this.animation === 'fade' ? fade : slide;
            return animationFn(action, target, this.duration)
                .then(() => trigger(toWindow(target), 'resize'), noop);
        }
    }
};
