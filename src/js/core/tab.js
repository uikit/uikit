import {isNumber, isString} from '../util/index';

export default function (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

        mixins: [UIkit.mixin.class],

        name: 'tab',

        props: {
            media: Number
        },

        defaults: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        ready() {

            this.vertical = this.$el.hasClass('uk-tab-left') && 'uk-tab-left' || this.$el.hasClass('uk-tab-right') && 'uk-tab-right';

        },

        update: {

            handler() {

                this.$el.toggleClass(this.vertical || '', this.vertical && this.media
                    && isNumber(this.media) && window.innerWidth >= this.media
                    || isString(this.media) && window.matchMedia(this.media).matches);

            },

            events: ['resize', 'orientationchange']

        }

    }));

}
