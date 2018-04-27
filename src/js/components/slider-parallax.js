import Parallax from '../mixin/parallax';
import {css, endsWith, noop, query, Transition} from 'uikit-util';

export default {

    mixins: [Parallax],

    data: {
        selItem: '!li'
    },

    computed: {

        item({selItem}, $el) {
            return query(selItem, $el);
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

};

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
