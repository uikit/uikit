import $ from 'jquery';
import { isString, getCssVar, hasTouch } from '../util/index';

var vars = {}; // css vars cache

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

        props: {
            href: 'jQuery',
            target: 'jQuery',
            mode: String,
            media: String
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

            this.$el.on('click', (e) => {

                if (String($(e.target).closest('a').attr('href'))[0] === '#') {
                    e.preventDefault();
                }

                this.toggle();
            });

        },

        update: {

            handler() {

                if (this.mode !== 'media' || !this.media) {
                    return;
                }

                if (isString(this.media) && this.media[0] == '@') {

                    var name = `media-${this.media.substr(1)}`;

                    if (!vars[name] && undefined === (vars[name] = getCssVar(name))) {
                        return;
                    }

                    this.media = `(min-width: ${vars[name]})`;

                } else if (!isNaN(this.media)) {
                    this.media = `(min-width: ${this.media}px)`;
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
