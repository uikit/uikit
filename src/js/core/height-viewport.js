import { css, docEl, endsWith, height, isNumeric, isString, offset, query, toFloat, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean,
            minHeight: Number
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false,
            minHeight: 0
        },

        update: {

            write() {

                css(this.$el, 'boxSizing', 'border-box');

                var viewport = height(win), minHeight, offsetTop = 0;

                if (this.expand) {

                    css(this.$el, {height: '', minHeight: ''});

                    var diff = viewport - offsetHeight(docEl);

                    if (diff > 0) {
                        minHeight = offsetHeight(this.$el) + diff;
                    }

                } else {

                    var top = offset(this.$el).top;

                    if (top < viewport / 2 && this.offsetTop) {
                        offsetTop += top;
                    }

                    if (this.offsetBottom === true) {

                        offsetTop += offsetHeight(this.$el.nextElementSibling);

                    } else if (isNumeric(this.offsetBottom)) {

                        offsetTop += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                        offsetTop += toFloat(this.offsetBottom);

                    } else if (isString(this.offsetBottom)) {

                        offsetTop += offsetHeight(query(this.offsetBottom, this.$el));

                    }

                    // on mobile devices (iOS and Android) window.innerHeight !== 100vh
                    minHeight = offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh';

                }

                if (!minHeight) {
                    return;
                }

                css(this.$el, {height: '', minHeight});

                var elHeight = this.$el.offsetHeight;
                if (this.minHeight && this.minHeight > elHeight) {
                    css(this.$el, 'minHeight', this.minHeight);
                }

                // IE 11 fix (min-height on a flex container won't apply to its flex items)
                if (viewport - offsetTop >= elHeight) {
                    css(this.$el, 'height', minHeight);
                }

            },

            events: ['load', 'resize']

        }

    });

    function offsetHeight(el) {
        return el && el.offsetHeight || 0;
    }

}
