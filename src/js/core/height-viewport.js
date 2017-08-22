import { isNumeric, isString, offset, query } from '../util/index';

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

                var viewport = window.innerHeight, height, offsetTop = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff)
                    }

                } else {

                    var top = offset(this.$el).top;

                    if (top < viewport / 2 && this.offsetTop) {
                        offsetTop += top;
                    }

                    if (this.offsetBottom === true) {

                        offsetTop += this.$el.next().outerHeight() || 0;

                    } else if (isNumeric(this.offsetBottom)) {

                        offsetTop += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && this.offsetBottom.substr(-2) === 'px') {

                        offsetTop += parseFloat(this.offsetBottom);

                    } else if (isString(this.offsetBottom)) {

                        var el = query(this.offsetBottom, this.$el);
                        offsetTop += el && el.outerHeight() || 0;

                    }

                    this.$el.css('min-height', height = offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.height('');
                if (height && viewport - offsetTop >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize']

        }

    });

}
