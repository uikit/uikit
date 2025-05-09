import { css, toFloat, Transition } from 'uikit-util';
import Class from '../mixin/class';
import { maybeDefaultPreventClick } from '../mixin/event';
import Togglable from '../mixin/togglable';

export default {
    mixins: [Class, Togglable],

    args: 'animation',

    props: {
        animation: Boolean,
        close: String,
    },

    data: {
        animation: true,
        selClose: '.uk-alert-close',
        duration: 150,
    },

    events: {
        name: 'click',

        delegate: ({ selClose }) => selClose,

        handler(e) {
            maybeDefaultPreventClick(e);
            this.close();
        },
    },

    methods: {
        async close() {
            await this.toggleElement(this.$el, false, animate);
            this.$destroy(true);
        },
    },
};

function animate(el, show, { duration, transition, velocity }) {
    const height = toFloat(css(el, 'height'));
    css(el, 'height', height);
    return Transition.start(
        el,
        {
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            borderTop: 0,
            borderBottom: 0,
            opacity: 0,
        },
        velocity * height + duration,
        transition,
    );
}
