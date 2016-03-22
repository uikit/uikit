export default function (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

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
                    && typeof(this.media) === 'number' && window.innerWidth >= this.media
                    || typeof(this.media) === 'string' && window.matchMedia(this.media).matches);

            },

            events: ['resize', 'orientationchange']

        }

    }));

}
