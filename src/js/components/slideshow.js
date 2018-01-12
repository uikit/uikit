import Parallax from '../mixin/parallax';
import Slideshow from '../mixin/slideshow';
import AnimationsPlugin from './internal/slideshow-animations';
import SliderReactive from '../mixin/internal/slider-reactive';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Parallax);
    UIkit.use(Slideshow);

    var {mixin} = UIkit;
    var {closest, css, endsWith, height, noop, Transition} = UIkit.util;

    var Animations = AnimationsPlugin(UIkit);

    UIkit.component('slideshow', {

        mixins: [mixin.class, mixin.slideshow, SliderReactive(UIkit)],

        props: {
            ratio: String,
            minHeight: Boolean,
            maxHeight: Boolean,
        },

        defaults: {
            ratio: '16:9',
            minHeight: false,
            maxHeight: false,
            selList: '.uk-slideshow-items',
            attrItem: 'uk-slideshow-item',
            selNav: '.uk-slideshow-nav',
            Animations
        },

        update: {

            read() {

                var [width, height] = this.ratio.split(':').map(Number);

                height = height * this.$el.offsetWidth / width;

                if (this.minHeight) {
                    height = Math.max(this.minHeight, height);
                }

                if (this.maxHeight) {
                    height = Math.min(this.maxHeight, height);
                }

                return {height};
            },

            write({height: hgt}) {
                height(this.list, Math.floor(hgt));
            },

            events: ['load', 'resize']

        }

    });

    UIkit.component('slideshow-parallax', {

        mixins: [mixin.parallax],

        computed: {

            item() {
                var slideshow = UIkit.getComponent(closest(this.$el, '.uk-slideshow'), 'slideshow');
                return slideshow && closest(this.$el, slideshow.slidesSelector);
            }

        },

        events: [

            {

                name: 'itemshown',

                self: true,

                el() {
                    return this.item;
                },

                handler() {
                    css(this.$el, this.getCss(.5));
                }

            },

            {
                name: 'itemin itemout',

                self: true,

                el() {
                    return this.item;
                },

                handler({type, detail: {percent, duration, timing, dir}}) {

                    Transition.cancel(this.$el);
                    css(this.$el, this.getCss(getCurrent(type, dir, percent)));

                    Transition.start(this.$el, this.getCss(isIn(type)
                        ? .5
                        : dir > 0
                            ? 1
                            : 0
                    ), duration, timing).catch(noop);

                }
            },

            {
                name: 'transitioncanceled transitionend',

                self: true,

                el() {
                    return this.item;
                },

                handler() {
                    Transition.cancel(this.$el);
                }

            },

            {
                name: 'itemtranslatein itemtranslateout',

                self: true,

                el() {
                    return this.item;
                },

                handler({type, detail: {percent, dir}}) {
                    Transition.cancel(this.$el);
                    css(this.$el, this.getCss(getCurrent(type, dir, percent)));
                }
            }

        ]

    });

    function isIn(type) {
        return endsWith(type, 'in');
    }

    function getCurrent(type, dir, percent) {

        percent /= 2;

        return !isIn(type)
            ? dir < 0
                ? percent
                : 1 - percent
            : dir < 0
                ? 1 - percent
                : percent;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
