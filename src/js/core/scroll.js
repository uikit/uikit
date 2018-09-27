import {$, clamp, escape, height, offset, scrollTop, trigger} from 'uikit-util';

export default {

    props: {
        duration: Number,
        offset: Number
    },

    data: {
        duration: 1000,
        offset: 0
    },

    methods: {

        scrollTo(el) {

            el = el && $(el) || document.body;

            const docHeight = height(document);
            const winHeight = height(window);

            let target = offset(el).top - this.offset;
            if (target + winHeight > docHeight) {
                target = docHeight - winHeight;
            }

            if (!trigger(this.$el, 'beforescroll', [this, el])) {
                return;
            }

            const start = Date.now();
            const startY = window.pageYOffset;
            const step = () => {

                const currentY = startY + (target - startY) * ease(clamp((Date.now() - start) / this.duration));

                scrollTop(window, currentY);

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
            this.scrollTo(escape(decodeURIComponent(this.$el.hash)).substr(1));
        }

    }

};

function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
}
