import { $, doc, height, offset, trigger, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('scroll', {

        props: {
            duration: Number,
            easing: String,
            offset: Number
        },

        defaults: {
            duration: 1000,
            easing: 'easeOutExpo',
            offset: 0
        },

        methods: {

            scrollTo(el) {

                var target = offset($(el)).top - this.offset,
                    docHeight = height(doc),
                    winHeight = height(win);

                if (target + winHeight > docHeight) {
                    target = docHeight - winHeight;
                }

                if (!trigger(this.$el, 'beforescroll', [this, el])) {
                    return;
                }

                $('html,body')
                    .stop()
                    .animate({scrollTop: Math.round(target)}, this.duration, this.easing)
                    .promise()
                    .then(() => trigger(this.$el, 'scrolled', [this, el]));

            }

        },

        events: {

            click(e) {

                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();
                this.scrollTo($(this.$el[0].hash).length ? this.$el[0].hash : 'body');
            }

        }

    });

    $.easing.easeOutExpo = $.easing.easeOutExpo || function (x, t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

}
