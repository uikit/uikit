import Class from '../mixin/class';
import Togglable from '../mixin/togglable';
import {assign} from 'uikit-util';

export default {

    mixins: [Class, Togglable],

    args: 'animation',

    props: {
        close: String
    },

    data: {
        animation: [true],
        selClose: '.uk-alert-close',
        duration: 150,
        hideProps: assign({opacity: 0}, Togglable.data.hideProps)
    },

    events: [

        {

            name: 'click',

            delegate() {
                return this.selClose;
            },

            handler(e) {
                e.preventDefault();
                this.close();
            }

        }

    ],

    methods: {

        async close() {
            await this.toggleElement(this.$el);
            this.$destroy(true);
        }

    }

};
