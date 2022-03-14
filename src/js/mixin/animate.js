import fade from './internal/animate-fade';
import slide from './internal/animate-slide';
import { noop } from 'uikit-util';

export default {
    props: {
        duration: Number,
        animation: Boolean,
    },

    data: {
        duration: 150,
        animation: 'slide',
    },

    methods: {
        animate(action, target = this.$el) {
            const name = this.animation;
            const animationFn =
                name === 'fade'
                    ? fade
                    : name === 'delayed-fade'
                    ? (...args) => fade(...args, 40)
                    : name
                    ? slide
                    : () => {
                          action();
                          return Promise.resolve();
                      };

            return animationFn(action, target, this.duration).then(
                () => this.$update(target, 'resize'),
                noop
            );
        },
    },
};
