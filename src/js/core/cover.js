import Video from './video';
import Class from '../mixin/class';
import {css, Dimensions} from 'uikit-util';

export default {

    mixins: [Class, Video],

    props: {
        width: Number,
        height: Number
    },

    data: {
        automute: true
    },

    update: {

        read() {

            const el = this.$el;
            const {offsetHeight: height, offsetWidth: width} = el.parentNode;
            const dim = Dimensions.cover(
                {
                    width: this.width || el.naturalWidth || el.videoWidth || el.clientWidth,
                    height: this.height || el.naturalHeight || el.videoHeight || el.clientHeight
                },
                {
                    width: width + (width % 2 ? 1 : 0),
                    height: height + (height % 2 ? 1 : 0)
                }
            );

            if (!dim.width || !dim.height) {
                return false;
            }

            return dim;
        },

        write({height, width}) {
            css(this.$el, {height, width});
        },

        events: ['resize']

    }

};
