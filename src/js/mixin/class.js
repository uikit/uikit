import { addClass } from 'uikit-util';

export default {
    connected() {
        addClass(this.$el, this.$options.id);
    },
};
