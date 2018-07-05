import Video from './video';
import Class from '../mixin/class';
import {css, Dimensions, isVisible} from 'uikit-util';

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

            if (!isVisible(el)) {
                return false;
            }

            const {offsetHeight: height, offsetWidth: width} = el.parentNode;

            return {height, width};
        },

        write({height, width}) {

            const el = this.$el;
            const elWidth = this.width || el.naturalWidth || el.videoWidth || el.clientWidth;
            const elHeight = this.height || el.naturalHeight || el.videoHeight || el.clientHeight;

            if (!elWidth || !elHeight) {
                return;
            }

            css(el, Dimensions.cover(
                {
                    width: elWidth,
                    height: elHeight
                },
                {
                    width: width + (width % 2 ? 1 : 0),
                    height: height + (height % 2 ? 1 : 0)
                }
            ));

        },

        events: ['load', 'resize']

    }

};
