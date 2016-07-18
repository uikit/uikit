import $ from 'jquery';
import {hasTouch} from '../util/index';

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
            mode: 'click'
        },

        ready() {

            this.target = this.target || this.href;

            this.mode = hasTouch ? 'click' : this.mode;

            if (this.mode === 'hover') {
                this.$el.on({
                    mouseenter: () => this.toggle('toggleShow'),
                    mouseleave: () => this.toggle('toggleHide')
                })
            }

        },

        events: {

            click(e) {

                if (String($(e.target).closest('a').attr('href'))[0] === '#') {
                    e.preventDefault();
                }

                this.toggle();
            }

        },

        methods: {

            toggle(type) {

                if (this.media) {

                    var mediaQuery;

                    if (typeof(this.media) == 'string') {

                        if (this.media[0] == '@') {
                            mediaQuery = '(min-width: '+UIkit.util.getCssVar('media-'+this.media.substr(1))+')';
                        }

                    } else if (typeof(this.media) == 'number') {
                        mediaQuery = '(min-width: '+this.media+'px)';
                    }

                    if (mediaQuery && !window.matchMedia(mediaQuery).matches) return;
                }

                var event = $.Event(type || 'toggle');
                this.target.triggerHandler(event, [this]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

}
