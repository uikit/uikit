import {addClass, hasClass} from 'uikit-util';

export default {

    connected() {
        !hasClass(this.$el, this.$name) && addClass(this.$el, this.$name);
    }

};
