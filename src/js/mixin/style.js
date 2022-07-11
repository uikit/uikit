import { attr } from 'uikit-util';

export default {
    beforeConnect() {
        this._style = attr(this.$el, 'style');
    },

    disconnected() {
        attr(this.$el, 'style', this._style);
    },
};
