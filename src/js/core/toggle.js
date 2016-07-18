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

            this.target = this.target || this.href || this.$el;

            this.mode = hasTouch && this.mode == 'hover' ? 'click' : this.mode;

            switch(this.mode) {

                case 'media':

                    if (this.media) {

                        var onresize = () => {

                            var mediaQuery;

                            if (typeof(this.media) == 'string') {

                                if (this.media[0] == '@') {
                                    var lessvar = 'media-'+this.media.substr(1);
                                    mediaQuery = `(min-width: ${UIkit.util.getCssVar(lessvar)})`;
                                }

                            } else if (typeof(this.media) == 'number') {
                                mediaQuery = '(min-width: '+this.media+'px)';
                            }

                            if (mediaQuery && window.matchMedia(mediaQuery).matches) {
                                this.toggle('toggleShow');
                            } else {
                                this.toggle('toggleHide')
                            }

                            return onresize;
                        };

                        $(window).on('resize', onresize());
                    }

                    break;

                case 'hover':

                    this.$el.on({
                        mouseenter: () => this.toggle('toggleShow'),
                        mouseleave: () => this.toggle('toggleHide')
                    });

                    break;

                case 'click':

                    this.$el.on('click', (e) => {

                        if (String($(e.target).closest('a').attr('href'))[0] === '#') {
                            e.preventDefault();
                        }

                        this.toggle();
                    });

                    break;
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

        }

    });

}
