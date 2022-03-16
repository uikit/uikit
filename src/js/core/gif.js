import { isInView, observeIntersection } from 'uikit-util';

// Deprecated
export default {
    connected() {
        this.registerObserver(observeIntersection(this.$el, () => this.$emit()));
    },

    update: {
        read(data) {
            const inview = isInView(this.$el);

            if (!inview || data.isInView === inview) {
                return false;
            }

            data.isInView = inview;
        },

        write() {
            this.$el.src = '' + this.$el.src; // force self-assign
        },
    },
};
