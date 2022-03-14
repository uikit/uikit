import { $, attr, matches } from 'uikit-util';

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

            el() {
                return document;
            },

            filter() {
                return this.autoplay;
            },

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

            this.interval = setInterval(
                () =>
                    (!this.draggable || !$(':focus', this.$el)) &&
                    (!this.pauseOnHover || !matches(this.$el, ':hover')) &&
                    !this.stack.length &&
                    this.show('next'),
                this.autoplayInterval
            );
        },

        stopAutoplay() {
            this.interval && clearInterval(this.interval);
        },
    },
};
