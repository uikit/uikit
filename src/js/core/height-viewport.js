import Resize from '../mixin/resize';
import {
    boxModelAdjust,
    css,
    dimensions,
    endsWith,
    isNumeric,
    isString,
    isVisible,
    offsetPosition,
    offsetViewport,
    query,
    scrollParents,
    toFloat,
} from 'uikit-util';

export default {
    mixins: [Resize],

    props: {
        expand: Boolean,
        offsetTop: Boolean,
        offsetBottom: Boolean,
        minHeight: Number,
    },

    data: {
        expand: false,
        offsetTop: false,
        offsetBottom: false,
        minHeight: 0,
    },

    resizeTargets() {
        // check for offsetTop change
        return [this.$el, ...scrollParents(this.$el, /auto|scroll/)];
    },

    update: {
        read({ minHeight: prev }) {
            if (!isVisible(this.$el)) {
                return false;
            }

            let minHeight = '';
            const box = boxModelAdjust(this.$el, 'height', 'content-box');

            const { body, scrollingElement } = document;
            const [scrollElement] = scrollParents(this.$el, /auto|scroll/);
            const { height: viewportHeight } = offsetViewport(
                scrollElement === body ? scrollingElement : scrollElement
            );

            if (this.expand) {
                minHeight = Math.max(
                    viewportHeight -
                        (dimensions(scrollElement).height - dimensions(this.$el).height) -
                        box,
                    0
                );
            } else {
                const isScrollingElement =
                    scrollingElement === scrollElement || body === scrollElement;

                // on mobile devices (iOS and Android) window.innerHeight !== 100vh
                minHeight = `calc(${isScrollingElement ? '100vh' : `${viewportHeight}px`}`;

                if (this.offsetTop) {
                    if (isScrollingElement) {
                        const top = offsetPosition(this.$el)[0] - offsetPosition(scrollElement)[0];
                        minHeight += top > 0 && top < viewportHeight / 2 ? ` - ${top}px` : '';
                    } else {
                        minHeight += ` - ${css(scrollElement, 'paddingTop')}`;
                    }
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

            return { minHeight, prev };
        },

        write({ minHeight }) {
            css(this.$el, { minHeight });

            if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
                css(this.$el, 'minHeight', this.minHeight);
            }
        },

        events: ['resize'],
    },
};
