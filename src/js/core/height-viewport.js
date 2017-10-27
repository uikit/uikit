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

                var viewport = height(win), minHeight = 0, offsetTop = 0;

                if (this.expand) {

                    css(this.$el, {height: '', minHeight: ''});

                    var diff = viewport - docEl.offsetHeight;

                    if (diff > 0) {
                        minHeight = this.$el.offsetHeight + diff;
                    }

                } else {

                    var top = offset(this.$el).top;

                    if (top < viewport / 2 && this.offsetTop) {
                        offsetTop += top;
                    }

                    if (this.offsetBottom === true) {

                        offsetTop += this.$el.nextElementSibling.offsetHeight || 0;

                    } else if (isNumeric(this.offsetBottom)) {

                        offsetTop += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                        offsetTop += toFloat(this.offsetBottom);

                    } else if (isString(this.offsetBottom)) {

                        var el = query(this.offsetBottom, this.$el);
                        offsetTop += el && el.offsetHeight || 0;

                    }

                    minHeight = viewport - offsetTop;

                }

                css(this.$el, 'minHeight', Math.max(minHeight, this.minHeight) || '');

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                height(this.$el, '');
                if (minHeight && viewport - offsetTop >= this.$el.offsetHeight) {
                    css(this.$el, 'height', minHeight);
                }

            },

            events: ['load', 'resize']

        }

    });

}
