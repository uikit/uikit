import Parallax from './parallax';
import Slideshow, {scale3d, translate3d} from '../mixin/slideshow';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Parallax);
    UIkit.use(Slideshow);

    var {mixin} = UIkit;
    var {addClass, assign, closest, css, height} = UIkit.util;

    var Animations = assign({}, mixin.slideshow.defaults.Animations, {

        fade: {

            show() {
                return [
                    {opacity: 0, zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent, zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        scale: {

            show() {
                return [
                    {opacity: 0, transform: scale3d(1 + .5), zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent, transform: scale3d(1 + .5 * percent), zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        pull: {

            show(dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(100), zIndex: 0},
                        {transform: translate3d(), zIndex: -1},
                    ]
                    : [
                        {transform: translate3d(-100), zIndex: 0},
                        {transform: translate3d(), zIndex: -1}
                    ];
            },

            percent(current) {
                return Animations.translated(current);
            },

            translate(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(percent * 100), zIndex: 0},
                        {transform: translate3d(-30 * (1 - percent)), zIndex: -1},
                    ]
                    : [
                        {transform: translate3d(-percent * 100), zIndex: 0},
                        {transform: translate3d(30 * (1 - percent)), zIndex: -1}
                    ];
            }

        },

        push: {

            show(dir) {

                return dir < 0
                    ? [
                        {transform: translate3d(30), zIndex: -1},
                        {transform: translate3d(), zIndex: 0},
                    ]
                    : [
                        {transform: translate3d(-30), zIndex: -1},
                        {transform: translate3d(), zIndex: 0}
                    ];
            },

            percent(current, next) {
                return 1 - Animations.translated(next);
            },

            translate(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(30 * percent), zIndex: -1},
                        {transform: translate3d(-100 * (1 - percent)), zIndex: 0},
                    ]
                    : [
                        {transform: translate3d(-30 * percent), zIndex: -1},
                        {transform: translate3d(100 * (1 - percent)), zIndex: 0}
                    ];
            }

        }

    });

    UIkit.component('slideshow', {

        mixins: [mixin.class, mixin.slideshow],

        props: {
            width: String,
            height: Boolean,
            maxHeight: Boolean,
        },

        defaults: {
            animation: 'slide',
            width: 1900,
            height: 1200,
            clsList: 'uk-slideshow-items',
            attrItem: 'uk-slideshow-item',
            clsActive: 'uk-active',
            maxHeight: true,
            Animations
        },

        connected() {
            addClass(this.slides[this.index], this.clsActive);
        },

        update: {

            read() {
                this.height = this.$props.height * this.$el.offsetWidth / this.width;

                if (this.maxHeight) {
                    this.height = Math.min(this.$props.height, this.height);
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

                    this._percent = false;

                    if (!this.item) {
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
