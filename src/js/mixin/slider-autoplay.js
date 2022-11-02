import { attr, matches, pointerEnter, pointerLeave } from 'uikit-util';

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
        attr(this.list, 'aria-live', 'polite');
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
        {
            name: `${pointerEnter} focusin`,

            filter() {
                return this.autoplay;
            },

            handler: 'stopAutoplay',
        },
        {
            name: `${pointerLeave} focusout`,

            filter() {
                return this.autoplay;
            },

            handler: 'startAutoplay',
        },
    ],

    methods: {
        startAutoplay() {
            if (
                (this.draggable && matches(this.$el, ':focus-within')) ||
                (this.pauseOnHover && matches(this.$el, ':hover'))
            ) {
                return;
            }

            this.stopAutoplay();

            this.interval = setInterval(
                () => !this.stack.length && this.show('next'),
                this.autoplayInterval
            );

            attr(this.list, 'aria-live', 'off');
        },

        stopAutoplay() {
            clearInterval(this.interval);
            attr(this.list, 'aria-live', 'polite');
        },
    },
};
