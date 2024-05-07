import { attr, matches } from 'uikit-util';

export default {
    props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean,
    },

    data: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true,
    },

    connected() {
        attr(this.list, 'aria-live', this.autoplay ? 'off' : 'polite');
        this.autoplay && this.startAutoplay();
    },

    disconnected() {
        this.stopAutoplay();
    },

    update() {
        attr(this.slides, 'tabindex', '-1');
    },

    events: [
        {
            name: 'visibilitychange',

            el: () => document,

            filter: ({ autoplay }) => autoplay,

            handler() {
                if (document.hidden) {
                    this.stopAutoplay();
                } else {
                    this.startAutoplay();
                }
            },
        },
    ],

    methods: {
        startAutoplay() {
            this.stopAutoplay();

            this.interval = setInterval(() => {
                if (
                    !(
                        this.stack.length ||
                        (this.draggable &&
                            matches(this.$el, ':focus-within') &&
                            !matches(this.$el, ':focus')) ||
                        (this.pauseOnHover && matches(this.$el, ':hover'))
                    )
                ) {
                    this.show('next');
                }
            }, this.autoplayInterval);
        },

        stopAutoplay() {
            clearInterval(this.interval);
        },
    },
};
