import TransitionerPlugin from './internal/slider-transitioner';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin} = UIkit;
    var {css, fastdom, trigger} = UIkit.util;
    var Transitioner = TransitionerPlugin(UIkit);

    UIkit.component('slider', {

        mixins: [mixin.class, mixin.slideshow],

        props: {
            center: Boolean
        },

        defaults: {
            selList: '.uk-slider-items',
            attrItem: 'uk-slider-item',
            center: false,
            velocity: 1,
            Transitioner
        },

        computed: {

            maxIndex() {

                if (!this.finite || this.center) {
                    return this.length - 1;
                }

                var max = Transitioner.getMax(this.list), i = this.length;

                while (i--) {
                    if (this.list.children[i].offsetLeft < max) {
                        return Math.min(i + 1, this.length - 1);
                    }
                }

                return 0;
            },

            transitionOptions() {
                return {
                    center: this.center,
                    list: this.list
                };
            },

            finite({finite}) {
                return finite || Transitioner.getWidth(this.list) < this.list.offsetWidth + Transitioner.getMaxWidth(this.list);
            }

        },

        ready() {
            fastdom.write(() => this.show(this.index));
        },

        update: {

            write() {
                this._resetComputeds();
                trigger(this.slides[this.index], 'beforeitemshow');
                this._translate(1);
            },

            events: ['load', 'resize']

        },

        events: [

            {

                name: 'beforeitemshow',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler(e) {

                    var diff = Math.abs(this.index + (this.dir > 0
                        ? this.index < this.prevIndex ? this.maxIndex : 0
                        : this.index > this.prevIndex ? -this.maxIndex : 0
                    ) - this.prevIndex);

                    if (!this.dragging && diff > 1) {

                        for (var i = 0; i < diff; i++) {
                            this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
                        }

                        e.preventDefault();
                        return;
                    }

                    css(this.slides, 'order', '');

                    if (!this.finite) {

                        this.slides.forEach((slide, i) =>
                            css(slide, 'order', this.dir > 0 && i < this.prevIndex
                                ? 1
                                : this.dir < 0 && i >= this.index
                                    ? -1
                                    : ''
                            )
                        );

                        if (this.center) {

                            var index = this.dir > 0 ? this.prevIndex : this.index,
                                next = this.slides[index],
                                width = this.list.offsetWidth / 2 - next.offsetWidth / 2,
                                j = 0;

                            while (width >= 0 || this.dir < 0 && this.slides[this.getIndex(j + index, index)].offsetWidth + width > 0) {
                                var slideIndex = this.getIndex(--j + index, index),
                                    slide = this.slides[slideIndex];

                                css(slide, 'order', slideIndex > index ? -2 : -1);
                                width -= slide.offsetWidth;
                            }

                        }

                    }

                }

            }

        ]

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
