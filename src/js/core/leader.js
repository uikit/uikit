import Class from '../mixin/class';
import Media from '../mixin/media';
import { resize } from '../api/observables';
import { attr, css, toggleClass, unwrap, wrapInner } from 'uikit-util';

export default {
    mixins: [Class, Media],

    props: {
        fill: String,
    },

    data: {
        fill: '',
        clsWrapper: 'uk-leader-fill',
        clsHide: 'uk-leader-hide',
        attrFill: 'data-fill',
    },

    computed: {
        fill({ fill }) {
            return fill || css(this.$el, '--uk-leader-fill-content');
        },
    },

    connected() {
        [this.wrapper] = wrapInner(this.$el, `<span class="${this.clsWrapper}">`);
    },

    disconnected() {
        unwrap(this.wrapper.childNodes);
    },

    observe: resize(),

    update: {
        read() {
            const width = Math.trunc(this.$el.offsetWidth / 2);

            return {
                width,
                fill: this.fill,
                hide: !this.matchMedia,
            };
        },

        write({ width, fill, hide }) {
            toggleClass(this.wrapper, this.clsHide, hide);
            attr(this.wrapper, this.attrFill, new Array(width).join(fill));
        },

        events: ['resize'],
    },
};
