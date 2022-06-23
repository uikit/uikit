import Class from '../mixin/class';
import Togglable from '../mixin/togglable';

export default {
    mixins: [Class, Togglable],

    args: 'animation',

    props: {
        close: String,
    },

    data: {
        animation: ['reveal'],
        selClose: '.uk-alert-close',
        duration: 150,
        static: false,
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
            },
        },

        {
            name: 'beforetransitionstart',

            self: true,

            handler(e, props) {
                props.opacity = 0;
            },
        },
    ],

    methods: {
        async close() {
            await this.toggleElement(this.$el);
            this.$destroy(true);
        },
    },
};
