import { $, Event, hasTouch, isTouch, pointerEnter, pointerLeave, query } from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

        args: 'target',

        props: {
            href: String,
            target: null,
            mode: 'list',
            media: 'media'
        },

        defaults: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
            media: false
        },

        computed: {

            target() {
                return query(this.$props.target || this.href, this.$el) || this.$el;
            }

        },

        events: [

            {

                name: `${pointerEnter} ${pointerLeave}`,

                filter() {
                    return ~this.mode.indexOf('hover');
                },

                handler(e) {
                    if (!isTouch(e)) {
                        this.toggle(`toggle${e.type === pointerEnter ? 'show' : 'hide'}`);
                    }
                }

            },

            {

                name: 'click',

                filter() {
                    return ~this.mode.indexOf('click') || hasTouch;
                },

                handler(e) {

                    if (!isTouch(e) && !~this.mode.indexOf('click')) {
                        return;
                    }

                    // TODO better isToggled handling
                    var link = $(e.target).closest('a[href]');
                    if ($(e.target).closest('a[href="#"], button').length
                        || link.length && (
                            this.cls
                            || !this.target.is(':visible')
                            || link.attr('href')[0] === '#' && this.target.is(link.attr('href'))
                        )
                    ) {
                        e.preventDefault();
                    }

                    this.toggle();
                }

            }
        ],

        update: {

            write() {

                if (!~this.mode.indexOf('media') || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (window.matchMedia(this.media).matches ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize']

        },

        methods: {

            toggle(type) {

                var event = Event(type || 'toggle');
                this.target.triggerHandler(event, [this]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

}
