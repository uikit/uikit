import Margin from './margin';
import Class from '../mixin/class';
import {toggleClass} from 'uikit-util';

export default {

    extends: Margin,

    mixins: [Class],

    defaults: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack'
    },

    update: {

        write({stacks}) {

            toggleClass(this.$el, this.clsStack, stacks);

        },

        events: ['load', 'resize']

    }

};
