import { $, hasTouch } from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

        props: {
            href: 'jQuery',
            target: 'jQuery',
            mode: String,
            media: 'media'
        },

        defaults: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
            media: false
        },

        ready() {

            this.target = this.target || this.href || this.$el;

            this.mode = hasTouch && this.mode == 'hover' ? 'click' : this.mode;

            if (this.mode === 'media') {
                return;
            }

            if (this.mode === 'hover') {
                this.$el.on({
                    mouseenter: () => this.toggle('toggleShow'),
                    mouseleave: () => this.toggle('toggleHide')
                });
            }

            this.$el.on('click', e => {

                // TODO better isToggled handling
                if ($(e.target).closest('a[href="#"], button').length || $(e.target).closest('a[href]') && (this.cls || !this.target.is(':visible'))) {
                    e.preventDefault();
                }

                this.toggle();
            });

        },

        update: {

            write() {

                if (this.mode !== 'media' || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (window.matchMedia(this.media).matches ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            toggle(type) {

                var event = $.Event(type || 'toggle');
                this.target.triggerHandler(event, [this]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

}
