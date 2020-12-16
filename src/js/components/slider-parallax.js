import Parallax from '../mixin/parallax';
import {css, endsWith, fastdom, noop, query, Transition} from 'uikit-util';

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
            name: 'itemin itemout',

            self: true,

            el() {
                return this.item;
            },

            handler({type, detail: {percent, duration, timing, dir}}) {

                fastdom.read(() => {
                    const propsFrom = this.getCss(getCurrentPercent(type, dir, percent));
                    const propsTo = this.getCss(isIn(type) ? .5 : dir > 0 ? 1 : 0);
                    fastdom.write(() => {
                        css(this.$el, propsFrom);
                        Transition.start(this.$el, propsTo, duration, timing).catch(noop);
                    });
                });

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
                fastdom.read(() => {
                    const props = this.getCss(getCurrentPercent(type, dir, percent));
                    fastdom.write(() => css(this.$el, props));
                });
            }
        }

    ]

};

function isIn(type) {
    return endsWith(type, 'in');
}

function getCurrentPercent(type, dir, percent) {

    percent /= 2;

    return !isIn(type)
        ? dir < 0
            ? percent
            : 1 - percent
        : dir < 0
            ? 1 - percent
            : percent;
}
