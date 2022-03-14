import Animations from './internal/slideshow-animations';
import Transitioner from './internal/slideshow-transitioner';
import Slider from './slider.js';
import { addClass, removeClass } from 'uikit-util';

export default {
    mixins: [Slider],

    props: {
        animation: String,
    },

    data: {
        animation: 'slide',
        clsActivated: 'uk-transition-active',
        Animations,
        Transitioner,
    },

    computed: {
        animation({ animation, Animations }) {
            return { ...(Animations[animation] || Animations.slide), name: animation };
        },

        transitionOptions() {
            return { animation: this.animation };
        },
    },

    events: {
        beforeitemshow({ target }) {
            addClass(target, this.clsActive);
        },

        itemshown({ target }) {
            addClass(target, this.clsActivated);
        },

        itemhidden({ target }) {
            removeClass(target, this.clsActive, this.clsActivated);
        },
    },
};
