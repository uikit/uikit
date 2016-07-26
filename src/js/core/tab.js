import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

        mixins: [Class],

        name: 'tab',

        defaults: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        init() {

            this.cls = this.$el.hasClass('uk-tab-left') && 'uk-tab-left' || this.$el.hasClass('uk-tab-right') && 'uk-tab-right';

            if (this.cls) {
                UIkit.toggle(this.$el, {media: this.media, mode: 'media', cls: this.cls});
            }
        }

    }));

}
