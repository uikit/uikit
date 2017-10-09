import Parallax from './parallax';
import Slideshow from '../mixin/slideshow';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Parallax);
    UIkit.use(Slideshow);

    var {mixin} = UIkit;
    var {addClass, closest, css, height} = UIkit.util;

    UIkit.component('slideshow', {

        mixins: [mixin.class, mixin.slideshow],

        props: {
            width: String,
            height: Boolean,
        },

        defaults: {
            animation: 'swipe',
            duration: 800,
            width: 1900,
            height: 1200,
            clsList: 'uk-slideshow-items',
            attrItem: 'uk-slideshow-item',
            clsActive: 'uk-active',
        },

        connected() {
            addClass(this.slides[this.index], this.clsActive);
        },

        update: {

            read() {
                this.height = this.$props.height * this.$el.offsetWidth / this.width;
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

                    this._percent = false;

                    if (!this.slideshow || !this.item) {
                        return;
                    }

                    var {_animation} = this.slideshow;

                    if (!_animation) {
                        return;
                    }

                    var {current, next, dir} = _animation,
                        el = dir > 0 ? next : current;

                    if (this.item !== el) {
                        return;
                    }

                    var percent = _animation.percent();
                    this._percent = dir > 0 ? 1 - percent : percent;
                    this._active = true;

                },

                write() {

                    if (this._percent === false) {

                        if (this._active) {
                            this.reset();
                            this._active = false;
                        }

                        return;
                    }

                    this.$emit();

                    if (this._prev !== this._percent) {
                        css(this.$el, this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['translate', 'load', 'resize']
            }

        ]

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
