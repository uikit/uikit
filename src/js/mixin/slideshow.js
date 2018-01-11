import AnimationsPlugin from './internal/slideshow-animations';
import TransitionerPlugin from './internal/slideshow-transitioner';
import SliderPlugin from './slider.js';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(SliderPlugin);

    var {mixin} = UIkit;
    var {assign, fastdom, isNumber} = UIkit.util;

    var Animations = AnimationsPlugin(UIkit),
        Transitioner = TransitionerPlugin(UIkit);

    UIkit.mixin.slideshow = {

        mixins: [mixin.slider],

        props: {
            animation: String
        },

        defaults: {
            animation: 'slide',
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
            }

        }

    };

}

export default plugin;
