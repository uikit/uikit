import { observeResize } from 'uikit-util';

export default {
    connected() {
        this.registerObserver(
            observeResize(this.$options.resizeTargets?.call(this) || this.$el, () =>
                this.$emit('resize')
            )
        );
    },
};
