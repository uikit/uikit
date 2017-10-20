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
    var {closest, css, fastdom, endsWith, height, noop, Transition} = UIkit.util;

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

        ready() {
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

    UIkit.component('slideshow-parallax', {

        mixins: [mixin.parallax],

        computed: {

            item() {
                var slideshow = UIkit.getComponent(closest(this.$el, '.uk-slideshow'), 'slideshow');
                return slideshow && closest(this.$el, `${slideshow.selList} > *`);
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

                handler({type, detail: {percent, duration, ease, dir}}) {

                    Transition.cancel(this.$el);
                    css(this.$el, this.getCss(getCurrent(type, dir, percent)));

                    Transition.start(this.$el, this.getCss(isIn(type)
                        ? .5
                        : dir > 0
                            ? 1
                            : 0
                    ), duration, ease).catch(noop);

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
