import FlexBug from '../mixin/flex-bug';
import {boxModelAdjust, css, dimensions, endsWith, height, isNumeric, isString, isVisible, offset, query, toFloat} from 'uikit-util';

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

    update: {

        read({minHeight: prev}) {

            if (!isVisible(this.$el)) {
                return false;
            }

            let minHeight = '';
            const box = boxModelAdjust(this.$el, 'height', 'content-box');

            if (this.expand) {

                minHeight = height(window) - (dimensions(document.documentElement).height - dimensions(this.$el).height) - box || '';

            } else {

                // on mobile devices (iOS and Android) window.innerHeight !== 100vh
                minHeight = 'calc(100vh';

                if (this.offsetTop) {

                    const {top} = offset(this.$el);
                    minHeight += top > 0 && top < height(window) / 2 ? ` - ${top}px` : '';

                }

                if (this.offsetBottom === true) {

                    minHeight += ` - ${dimensions(this.$el.nextElementSibling).height}px`;

                } else if (isNumeric(this.offsetBottom)) {

                    minHeight += ` - ${this.offsetBottom}vh`;

                } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                    minHeight += ` - ${toFloat(this.offsetBottom)}px`;

                } else if (isString(this.offsetBottom)) {

                    minHeight += ` - ${dimensions(query(this.offsetBottom, this.$el)).height}px`;

                }

                minHeight += `${box ? ` - ${box}px` : ''})`;

            }

            return {minHeight, prev};
        },

        write({minHeight, prev}) {

            css(this.$el, {minHeight});

            if (minHeight !== prev) {
                this.$update(this.$el, 'resize');
            }

            if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
                css(this.$el, 'minHeight', this.minHeight);
            }

        },

        events: ['resize']

    }

};
