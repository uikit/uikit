export default function (UIkit) {

    const {doc, pointerDown} = UIkit.util;

    return {

        props: {
            autoplay: Boolean,
            autoplayInterval: Number,
            pauseOnHover: Boolean
        },

        defaults: {
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true
        },

        connected() {
            this.startAutoplay();
        },

        disconnected() {
            this.stopAutoplay();
        },

        events: [

            {

                name: 'visibilitychange',

                el: doc,

                handler() {
                    if (doc.hidden) {
                        this.stopAutoplay();
                    } else {
                        this.startAutoplay();
                    }
                }

            },

            {

                name: pointerDown,
                handler: 'stopAutoplay'

            },

            {

                name: 'mouseenter',

                filter() {
                    return this.autoplay;
                },

                handler() {
                    this.isHovering = true;
                }

            },

            {

                name: 'mouseleave',

                filter() {
                    return this.autoplay;
                },

                handler() {
                    this.isHovering = false;
                }

            }

        ],

        methods: {

            startAutoplay() {

                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(
                        () => !(this.isHovering && this.pauseOnHover) && !this.stack.length && this.show('next'),
                        this.autoplayInterval
                    );
                }

            },

            stopAutoplay() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };
}
