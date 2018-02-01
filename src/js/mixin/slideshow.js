import AnimationsPlugin from './internal/slideshow-animations';
import TransitionerPlugin from './internal/slideshow-transitioner';
import SliderPlugin from './slider.js';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(SliderPlugin);

    const {mixin, util: {addClass, assign, fastdom, isNumber, removeClass}} = UIkit;

    const Animations = AnimationsPlugin(UIkit);
    const Transitioner = TransitionerPlugin(UIkit);

    UIkit.mixin.slideshow = {

        mixins: [mixin.slider],

        props: {
            animation: String
        },

        defaults: {
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
                UIkit.update(null, target);
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

}

export default plugin;
