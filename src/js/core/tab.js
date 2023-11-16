import { hasClass } from 'uikit-util';
import Class from '../mixin/class';
import Switcher from './switcher';

export default {
    mixins: [Class],

    extends: Switcher,

    props: {
        media: Boolean,
    },

    data: {
        media: 960,
        attrItem: 'uk-tab-item',
        selVertical: '.uk-tab-left,.uk-tab-right',
    },

    connected() {
        const cls = hasClass(this.$el, 'uk-tab-left')
            ? 'uk-tab-left'
            : hasClass(this.$el, 'uk-tab-right')
              ? 'uk-tab-right'
              : false;

        if (cls) {
            this.$create('toggle', this.$el, { cls, mode: 'media', media: this.media });
        }
    },
};
