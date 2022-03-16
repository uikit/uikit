import { observeResize } from 'uikit-util';

export default {
    computed: {
        resizeTargets() {
            return this.$el;
        },
    },

    connected() {
        this.registerObserver(observeResize(this.resizeTargets, () => this.$emit('resize')));
    },
};
