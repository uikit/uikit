import {addClass} from '../util/class';
import {isVisible} from '../util/filter';
import {Dimensions} from '../util/lang';
import {width, height} from '../util/dimensions';

export default function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        init() {
            addClass(this.$el, 'uk-responsive-width');
        },

        update: {

            read() {
                return isVisible(this.$el) && this.width && this.height
                    ? {width: width(this.$el.parentNode), height: this.height}
                    : false;
            },

            write(dim) {
                height(this.$el, Dimensions.contain({height: this.height, width: this.width}, dim).height);
            },

            events: ['load', 'resize']

        }

    });

}
