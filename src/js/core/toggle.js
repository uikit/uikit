import { $, $trigger, hasTouch, isTouch, pointerEnter, pointerLeave, query } from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.togglable],

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
                    var link = $(e.target).closest('a[href]')[0];
                    if ($(e.target).closest('a[href="#"], button').length
                        || link && (
                            this.cls
                            || !this.target.is(':visible')
                            || link.hash && this.target.is(link.hash)
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
                if (!$trigger(this.target, type || 'toggle', [this], true).isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

}
