import { Class } from '../mixin/index';
import { attr, getCssVar, toggleClass, unwrap, win, wrapInner } from '../util/index';

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

            fill({fill}) {
                return fill || getCssVar('leader-fill');
            }

        },

        connected() {
            this.wrapper = wrapInner(this.$el, `<span class="${this.clsWrapper}">`)[0];
        },

        disconnected() {
            unwrap(this.wrapper.childNodes);
            delete this._width;
        },

        update: [

            {

                read() {
                    var prev = this._width;
                    this._width = Math.floor(this.$el.offsetWidth / 2);
                    this._changed = prev !== this._width;
                    this._hide = this.media && !win.matchMedia(this.media).matches;
                },

                write() {

                    toggleClass(this.wrapper, this.clsHide, this._hide);

                    if (this._changed) {
                        attr(this.wrapper, this.attrFill, new Array(this._width).join(this.fill));
                    }

                },

                events: ['load', 'resize']

            }
        ]
    });

}
