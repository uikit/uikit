import {$, clamp, doc, escape, height, offset, trigger, win} from '../util/index';

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

                el = el && $(el) || doc.body;

                const docHeight = height(doc);
                const winHeight = height(win);

                let target = offset(el).top - this.offset;
                if (target + winHeight > docHeight) {
                    target = docHeight - winHeight;
                }

                if (!trigger(this.$el, 'beforescroll', [this, el])) {
                    return;
                }

                const start = Date.now();
                const startY = win.pageYOffset;
                const step = () => {

                    const currentY = startY + (target - startY) * ease(clamp((Date.now() - start) / this.duration));

                    win.scrollTo(win.pageXOffset, currentY);

                    // scroll more if we have not reached our destination
                    if (currentY !== target) {
                        requestAnimationFrame(step);
                    } else {
                        trigger(this.$el, 'scrolled', [this, el]);
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
                this.scrollTo(escape(this.$el.hash).substr(1));
            }

        }

    });

    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

}
