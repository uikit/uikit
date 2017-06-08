import { Dimensions } from '../util/index';

export default function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        init() {
            this.$addClass('uk-responsive-width');
        },

        update: {

            read() {

                this.dim = this.$el.is(':visible') && this.width && this.height
                    ? {width: this.$el.parent().width(), height: this.height}
                    : false;

            },

            write() {

                if (this.dim) {
                    this.$el.height(Dimensions.contain({height: this.height, width: this.width}, this.dim).height);
                }

            },

            events: ['load', 'resize']

        }

    });

}
