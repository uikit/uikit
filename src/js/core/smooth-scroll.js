import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('smooth-scroll', {

        props: {
            duration: Number,
            transition: String,
            offset: Number
        },

        defaults: {
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0,
            complete: null
        },

        methods: {

            scrollToElement(el) {

                el = $(el);

                // get / set parameters
                var target = el.offset().top - this.offset, docHeight = $(document).height(), winHeight = window.innerHeight;

                if ((target + winHeight) > docHeight) {
                    target = docHeight - winHeight;
                }

                // animate to target, fire callback when done
                $('body').stop().animate({scrollTop: target}, this.duration, this.transition, this.complete);

            }

        },

        events: {
            click(e) {
                e.preventDefault();
                this.scrollToElement($(this.$el[0].hash).length ? this.$el[0].hash : 'body');
            }
        }

    });

    if (!$.easing.easeOutExpo) {
        $.easing.easeOutExpo = function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
    }

}
