import { docEl, endsWith, height, isNumeric, isString, offset, query, toFloat, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false
        },

        update: {

            write() {

                this.$el.css('boxSizing', 'border-box');

                var viewport = height(win), minHeight, offsetTop = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - docEl.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('minHeight', minHeight = this.$el[0].offsetHeight + diff)
                    }

                } else {

                    var top = offset(this.$el).top;

                    if (top < viewport / 2 && this.offsetTop) {
                        offsetTop += top;
                    }

                    if (this.offsetBottom === true) {

                        offsetTop += this.$el.next()[0].offsetHeight || 0;

                    } else if (isNumeric(this.offsetBottom)) {

                        offsetTop += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                        offsetTop += toFloat(this.offsetBottom);

                    } else if (isString(this.offsetBottom)) {

                        var el = query(this.offsetBottom, this.$el);
                        offsetTop += el && el[0].offsetHeight || 0;

                    }

                    this.$el.css('minHeight', minHeight = offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                height(this.$el, '');
                if (minHeight && viewport - offsetTop >= this.$el[0].offsetHeight) {
                    this.$el.css('height', minHeight);
                }

            },

            events: ['load', 'resize']

        }

    });

}
