import Parallax from './parallax';
import Slideshow from '../mixin/slideshow';
import Animations from './internal/slideshow-animations';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Parallax);
    UIkit.use(Slideshow);

    var {mixin} = UIkit;
    var {closest, css, fastdom, endsWith, height, isVisible, noop, Transition} = UIkit.util;

    UIkit.component('slideshow', {

        mixins: [mixin.class, mixin.slideshow],

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
            Animations: Animations(UIkit)
        },

        connected() {
            fastdom.mutate(() => this.show(this.index));
        },

        update: {

            read() {
                var [width, height] = this.ratio.split(':').map(Number);
                this.height = height * this.$el.offsetWidth / width;

                if (this.minHeight) {
                    this.height = Math.max(this.minHeight, this.height);
                }

                if (this.maxHeight) {
                    this.height = Math.min(this.maxHeight, this.height);
                }
            },

            write() {
                height(this.list, Math.floor(this.height));
            },

            events: ['load', 'resize']

        }

    });

    UIkit.component('slideshow-parallax-in', {

        mixins: [mixin.parallax],

        connected() {
            fastdom.mutate(() => {
                var visible;
                fastdom.measure(() => visible = isVisible(this.$el));
                fastdom.mutate(() => visible && css(this.$el, this.getCss(this.out ? 0 : 1)));
            });
        },

        computed: {

            item() {
                var slideshow = UIkit.getComponent(closest(this.$el, '.uk-slideshow'), 'slideshow');
                return slideshow && slideshow.slides.filter(slide => slide.contains(this.$el))[0];
            }

        },

        events: [

            {
                name: 'itemin itemout',

                self: true,

                el() {
                    return this.item;
                },

                handler({type, detail: {percent, duration, ease, dir}}) {

                    if (isResponsible(type, this.out, dir)) {
                        Transition.cancel(this.$el);
                        css(this.$el, this.getCss(dir < 0 ? 1 - percent : percent));
                        Transition.start(this.$el, this.getCss(dir < 0 ? 0 : 1), duration, ease).catch(noop);
                    }

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

                    if (isResponsible(type, this.out, dir)) {
                        Transition.cancel(this.$el);
                        css(this.$el, this.getCss(dir < 0 ? 1 - percent : percent));
                    }

                }
            }

        ]

    });

    UIkit.component('slideshow-parallax-out', UIkit.components.slideshowParallaxIn.extend({defaults: {out: true}}));

    function isResponsible(type, out, dir) {
        var isInEvent = endsWith(type, 'in'),
            matches = isInEvent && !out || !isInEvent && out;

        return matches && dir > 0 || !matches && dir < 0;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
