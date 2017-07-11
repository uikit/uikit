import { $, docHeight, offsetTop } from '../util/index';

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

            scrollToElement(el) {

                // get / set parameters
                var target = offsetTop($(el)) - this.offset,
                    document = docHeight(),
                    viewport = window.innerHeight;

                if (target + viewport > document) {
                    target = document - viewport;
                }

                // animate to target, fire callback when done
                $('html,body')
                    .stop()
                    .animate({scrollTop: Math.round(target)}, this.duration, this.easing)
                    .promise()
                    .then(() => this.$el.trigger('scrolled', [this]));

            }

        },

        events: {

            click(e) {

                if (e.isDefaultPrevented()) {
                    return;
                }

                e.preventDefault();
                var elHash = this.$el[0].hash.replace('/', '\\/');
                this.scrollToElement($(elHash).length ? elHash : 'body');
            }

        }

    });

    $.easing.easeOutExpo = $.easing.easeOutExpo || function (x, t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

}
