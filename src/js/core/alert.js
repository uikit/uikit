import Class from '../mixin/class';
import Togglable from '../mixin/togglable';

export default {
    mixins: [Class, Togglable],

    args: 'animation',

    props: {
        close: String,
    },

    data: {
        animation: [true],
        selClose: '.uk-alert-close',
        duration: 150,
        hideProps: { opacity: 0, ...Togglable.data.hideProps },
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
    ],

    methods: {
        async close() {
            await this.toggleElement(this.$el);
            this.$destroy(true);
        },
    },
};
