import {addClass, Dimensions, height, isVisible, parent, width} from 'uikit-util';

export default {

    props: ['width', 'height'],

    connected() {
        addClass(this.$el, 'uk-responsive-width');
    },

    update: {

        read() {
            return isVisible(this.$el) && this.width && this.height
                ? {width: width(parent(this.$el)), height: this.height}
                : false;
        },

        write(dim) {
            height(this.$el, Dimensions.contain({
                height: this.height,
                width: this.width
            }, dim).height);
        },

        events: ['resize']

    }

};
