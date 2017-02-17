import { $, isTouch, pointerEnter, pointerLeave } from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

        args: 'target',

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

        events: [

            {

                name: `${pointerEnter} ${pointerLeave}`,

                filter() {
                    return this.mode === 'hover';
                },

                handler(e) {
                    if (!isTouch(e)) {
                        this.toggle(e.type === pointerEnter ? 'toggleShow' : 'toggleHide');
                    }
                }

            },

            {

                name: 'click',

                filter() {
                    return this.mode !== 'media';
                },

                handler(e) {
                    // TODO better isToggled handling
                    if ($(e.target).closest('a[href="#"], button').length || $(e.target).closest('a[href]') && (this.cls || !this.target.is(':visible'))) {
                        e.preventDefault();
                    }

                    this.toggle();
                }

            }
        ],

        update: {

            write() {

                this.target = this.target || this.href || this.$el;

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
