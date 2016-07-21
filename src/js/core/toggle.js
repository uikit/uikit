import $ from 'jquery';
import {hasTouch, getCssVar} from '../util/index';

var cssVars = {}; // css vars cache

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

            this.target = this.target || this.href || this.$el;

            this.mode = hasTouch && this.mode == 'hover' ? 'click' : this.mode;

            switch(this.mode) {

                case 'hover':

                    this.$el.on({
                        mouseenter: () => this.toggle('toggleShow'),
                        mouseleave: () => this.toggle('toggleHide')
                    });

                case 'click':

                    this.$el.on('click', (e) => {

                        if (String($(e.target).closest('a').attr('href'))[0] === '#') {
                            e.preventDefault();
                        }

                        this.toggle();
                    });
            }

        },

        methods: {

            toggle(type) {

                var event = $.Event(type || 'toggle');
                this.target.triggerHandler(event, [this]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        },

        update: {

            handler() {

                if (this.mode == 'media' && this.media) {

                    var mediaQuery;

                    if (typeof(this.media) == 'string') {

                        if (this.media[0] == '@') {

                            var cssvar =  'media-'+this.media.substr(1);

                            if (cssVars[cssvar] === undefined) {
                                cssVars[cssvar] = getCssVar(cssvar);
                            }

                            mediaQuery = `(min-width: ${cssVars[cssvar]})`;
                        }

                    } else if (typeof(this.media) == 'number') {
                        mediaQuery = '(min-width: '+this.media+'px)';
                    }

                    if (mediaQuery && window.matchMedia(mediaQuery).matches) {
                        if (!this.isToggled(this.$el)) {
                            this.toggle('toggleShow');
                        }
                    } else {
                        if (this.isToggled(this.$el)) {
                            this.toggle('toggleHide')
                        }
                    }
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
