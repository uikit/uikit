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
    var {closest, css, hasClass, height} = UIkit.util;

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
            this.show(this.index);
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

            slideshow() {
                return UIkit.getComponent(closest(this.$el, '.uk-slideshow'), 'slideshow');
            },

            item() {
                return this.slideshow && this.slideshow.slides.filter(slide => slide.contains(this.$el))[0];
            }

        },

        update: [

            {

                read() {

                    var prev = this._percent;
                    this._percent = false;

                    if (!this.item) {
                        return;
                    }

                    var {_animation} = this.slideshow;

                    if (!_animation) {

                        if (hasClass(this.item, this.slideshow.clsActivated) && prev !== 1) {
                            this._percent = 1;
                        }

                        return;
                    }

                    var {current, next, dir} = _animation,
                        el = dir > 0 ? next : current;

                    if (this.item !== el) {
                        return;
                    }

                    var percent = _animation.percent();
                    this._percent = dir < 0 ? 1 - percent : percent;

                },

                write() {

                    if (this._percent === false) {
                        return;
                    }

                    this.$emit();

                    if (this._prev !== this._percent) {
                        css(this.$el, this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['load', 'resize']
            }

        ]

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
