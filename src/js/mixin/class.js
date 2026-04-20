import { addClass, hasClass, removeClass } from 'uikit-util';

export default {
    connected() {
        this._cmpCls = hasClass(this.$el, this.$options.id);
        addClass(this.$el, this.$options.id);
    },

    disconnected() {
        if (!this._cmpCls) {
            removeClass(this.$el, this.$options.id);
        }
    },
};
