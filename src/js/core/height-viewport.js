import { $ } from '../util/index';

export default function (UIkit) {

    var doc = $(document), scroll = 0,
        active = false,
        setScroll = () => {
            if (active && scroll > doc.scrollTop()) {
                doc.scrollTop(scroll);
            }
        };

    doc.on('scroll', setScroll);
    $(window).one('load', () => {
        setScroll();
        doc.off('scroll', setScroll);
    });

    UIkit.component('height-viewport', {

        props: {
            mode: String
        },

        defaults: {
            mode: 'viewport'
        },

        init() {
            if (this.mode !== 'expand') {
                active = true;
                this.setHeight();
            }

            scroll = Math.max(scroll, doc.scrollTop());
        },

        ready() {
            scroll = Math.max(scroll, doc.scrollTop());
        },

        update: {

            handler() {

                if (this.mode !== 'expand') {
                    this.setHeight();
                    return;
                }

                this.$el.css('min-height', '');

                if (document.documentElement.offsetHeight < window.innerHeight) {
                    this.$el.css('min-height', this.$el.outerHeight()
                        + window.innerHeight
                        - document.documentElement.offsetHeight
                        - this.getPadding()
                    )
                }

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            getPadding() {
                return this.$el.css('box-sizing') === 'border-box' ? 0 : this.$el.outerHeight() - this.$el.height();
            },

            getHeight() {

                var height = window.innerHeight;

                if (this.mode === 'offset' && this.$el.offset().top < height) {
                    height -= this.$el.offset().top + this.getPadding();
                }

                return height;
            },

            setHeight() {

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css({height: '', minHeight: ''});
                if (this.getHeight() >= this.$el.outerHeight()) {
                    this.$el.css('height', this.getHeight());
                }

                this.$el.css('min-height', this.getHeight());
            }

        }

    });

}
