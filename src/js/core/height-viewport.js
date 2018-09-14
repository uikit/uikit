import FlexBug from '../mixin/flex-bug';
import {css, endsWith, height, isNumeric, isString, offset, query, toFloat} from 'uikit-util';

export default {

    mixins: [FlexBug],

    props: {
        expand: Boolean,
        offsetTop: Boolean,
        offsetBottom: Boolean,
        minHeight: Number
    },

    data: {
        expand: false,
        offsetTop: false,
        offsetBottom: false,
        minHeight: 0
    },

    connected() {
        css(this.$el, 'boxSizing', 'border-box');
    },

    update: {

        read() {

            const viewport = height(window);
            let minHeight = '';

            if (this.expand) {

                minHeight = viewport - (offsetHeight(document.documentElement) - offsetHeight(this.$el)) || '';

            } else {

                const {top} = offset(this.$el);

                // on mobile devices (iOS and Android) window.innerHeight !== 100vh
                minHeight = 'calc(100vh';

                if (top < viewport / 2 && this.offsetTop) {
                    minHeight += ` - ${top}px`;
                }

                if (this.offsetBottom === true) {

                    minHeight += ` - ${offsetHeight(this.$el.nextElementSibling)}px`;

                } else if (isNumeric(this.offsetBottom)) {

                    minHeight += ` - ${this.offsetBottom}vh`;

                } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                    minHeight += ` - ${toFloat(this.offsetBottom)}px`;

                } else if (isString(this.offsetBottom)) {

                    minHeight += ` - ${offsetHeight(query(this.offsetBottom, this.$el))}px`;

                }

                minHeight += ')';

            }

            return {minHeight, viewport};
        },

        write({minHeight}) {

            css(this.$el, {minHeight});

            if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
                css(this.$el, 'minHeight', this.minHeight);
            }

        },

        events: ['load', 'resize']

    }

};

function offsetHeight(el) {
    return el && el.offsetHeight || 0;
}
