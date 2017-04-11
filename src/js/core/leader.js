import { Class } from '../mixin/index';
import { getCssVar } from '../util/index';

export default function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        props: {
            fill: String,
            media: 'media'
        },

        defaults: {
            fill: '',
            media: false,
            clsWrapper: 'uk-leader-fill',
            clsHide: 'uk-leader-hide',
            attrFill: 'data-fill'
        },

        computed: {

            fill() {
                return this.$props.fill || getCssVar('leader-fill');
            }

        },

        connected() {
            this.wrapper = this.$el.wrapInner(`<span class="${this.clsWrapper}">`).children().first();
        },

        disconnected() {
            this.wrapper.contents().unwrap();
        },

        update: [

            {

                read() {
                    var prev = this._width;
                    this._width = Math.floor(this.$el[0].offsetWidth / 2);
                    this._changed = prev !== this._width;
                    this._hide = this.media && !window.matchMedia(this.media).matches;
                },

                write() {

                    this.wrapper.toggleClass(this.clsHide, this._hide);

                    if (this._changed) {
                        this.wrapper.attr(this.attrFill, Array(this._width).join(this.fill));
                    }

               },

                events: ['load', 'resize']

            }
        ]
    });

}
