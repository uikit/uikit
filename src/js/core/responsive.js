import { Dimensions, height, isVisible, width } from '../util/index';

export default function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        init() {
            this.$addClass('uk-responsive-width');
        },

        update: {

            read() {

                this.dim = isVisible(this.$el) && this.width && this.height
                    ? {width: width(this.$el.parent()), height: this.height}
                    : false;

            },

            write() {

                if (this.dim) {
                    height(this.$el, Dimensions.contain({height: this.height, width: this.width}, this.dim).height);
                }

            },

            events: ['load', 'resize']

        }

    });

}
