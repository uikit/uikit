import Animations from './internal/slideshow-animations';
import Transitioner from './internal/slideshow-transitioner';
import Slider from './slider.js';
import {addClass, assign, fastdom, isNumber, removeClass} from 'uikit-util';

export default {

    mixins: [Slider],

    props: {
        animation: String
    },

    data: {
        animation: 'slide',
        clsActivated: 'uk-transition-active',
        Animations,
        Transitioner
    },

    computed: {

        animation({animation, Animations}) {
            return assign(animation in Animations ? Animations[animation] : Animations.slide, {name: animation});
        },

        transitionOptions() {
            return {animation: this.animation};
        }

    },

    events: {

        'itemshow itemhide itemshown itemhidden'({target}) {
            this.$update(target);
        },

        itemshow() {
            isNumber(this.prevIndex) && fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
        },

        beforeitemshow({target}) {
            addClass(target, this.clsActive);
        },

        itemshown({target}) {
            addClass(target, this.clsActivated);
        },

        itemhidden({target}) {
            removeClass(target, this.clsActive, this.clsActivated);
        }

    }

};
