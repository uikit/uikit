import {attr, within} from 'uikit-util';

export default {

    props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean
    },

    data: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true
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

            el: document,

            filter() {
                return this.autoplay;
            },

            handler() {
                if (document.hidden) {
                    this.stopAutoplay();
                } else {
                    this.startAutoplay();
                }
            }

        },

        {

            name: 'mouseenter',

            filter() {
                return this.autoplay && this.pauseOnHover;
            },

            handler() {
                this.isHovering = true;
            }

        },

        {

            name: 'mouseleave',

            filter() {
                return this.autoplay && this.pauseOnHover;
            },

            handler() {
                this.isHovering = false;
            }

        }

    ],

    methods: {

        startAutoplay() {

            this.stopAutoplay();

            this.interval = setInterval(
                () => !within(document.activeElement, this.$el)
                    && !this.isHovering
                    && !this.stack.length
                    && this.show('next'),
                this.autoplayInterval
            );

        },

        stopAutoplay() {
            this.interval && clearInterval(this.interval);
        }

    }

};
