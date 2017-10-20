import { $, clamp, doc, height, isString, offset, requestAnimationFrame, trigger, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('scroll', {

        props: {
            duration: Number,
            offset: Number
        },

        defaults: {
            duration: 1000,
            offset: 0
        },

        methods: {

            scrollTo(el) {

                el = el && $(isString(el) ? el.replace(/\//g, '\\/') : el) || doc.body;

                var target = offset(el).top - this.offset,
                    docHeight = height(doc),
                    winHeight = height(win);

                if (target + winHeight > docHeight) {
                    target = docHeight - winHeight;
                }

                if (!trigger(this.$el, 'beforescroll', [this, el])) {
                    return;
                }

                var start = Date.now(),
                    startY = win.pageYOffset,
                    step = () => {
                        var currentY = startY + (target - startY) * ease(clamp((Date.now() - start) / this.duration));

                        win.scrollTo(win.pageXOffset, currentY);

                        // scroll more if we have not reached our destination
                        if (currentY !== target) {
                            requestAnimationFrame(step);
                        } else {
                            trigger(this.$el, 'scrolled', [this, el])
                        }
                    };

                step();

            }

        },

        events: {

            click(e) {

                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();
                this.scrollTo(this.$el.hash);
            }

        }

    });

    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

}
