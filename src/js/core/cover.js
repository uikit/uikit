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

        write() {

            const el = this.$el;

            if (!isVisible(el)) {
                return;
            }

            const {offsetHeight: height, offsetWidth: width} = el.parentNode;

            css(
                css(el, {width: '', height: ''}),
                Dimensions.cover(
                    {
                        width: this.width || el.clientWidth,
                        height: this.height || el.clientHeight
                    },
                    {
                        width: width + (width % 2 ? 1 : 0),
                        height: height + (height % 2 ? 1 : 0)
                    }
                )
            );

        },

        events: ['load', 'resize']

    },

    events: {

        'loadedmetadata load'() {
            this.$emit();
        }

    }

};
