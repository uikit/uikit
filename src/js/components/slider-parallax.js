import { css, endsWith, fastdom, noop, Transition } from 'uikit-util';
import Parallax from '../mixin/parallax';

export default {
    mixins: [Parallax],

    beforeConnect() {
        this.item = this.$el.closest(`.${this.$options.id.replace('parallax', 'items')} > *`);
    },

    disconnected() {
        this.item = null;
    },

    events: [
        {
            name: 'itemin itemout',

            self: true,

            el: ({ item }) => item,

            handler({ type, detail: { percent, duration, timing, dir } }) {
                fastdom.read(() => {
                    if (!this.matchMedia) {
                        return;
                    }

                    const propsFrom = this.getCss(getCurrentPercent(type, dir, percent));
                    const propsTo = this.getCss(isIn(type) ? 0.5 : dir > 0 ? 1 : 0);
                    fastdom.write(() => {
                        css(this.$el, propsFrom);
                        Transition.start(this.$el, propsTo, duration, timing).catch(noop);
                    });
                });
            },
        },

        {
            name: 'transitioncanceled transitionend',

            self: true,

            el: ({ item }) => item,

            handler() {
                Transition.cancel(this.$el);
            },
        },

        {
            name: 'itemtranslatein itemtranslateout',

            self: true,

            el: ({ item }) => item,

            handler({ type, detail: { percent, dir } }) {
                fastdom.read(() => {
                    if (!this.matchMedia) {
                        this.reset();
                        return;
                    }

                    const props = this.getCss(getCurrentPercent(type, dir, percent));
                    fastdom.write(() => css(this.$el, props));
                });
            },
        },
    ],
};

function isIn(type) {
    return endsWith(type, 'in');
}

function getCurrentPercent(type, dir, percent) {
    percent /= 2;

    return isIn(type) ^ (dir < 0) ? percent : 1 - percent;
}
