import {
    addClass,
    attr,
    css,
    includes,
    isTag,
    memoize,
    once,
    removeAttr,
    startsWith,
} from 'uikit-util';
import { mutation } from '../api/observables';
import Svg, { parseSVG } from '../mixin/svg';
import { getMaxPathLength } from '../util/svg';

export default {
    mixins: [Svg],

    args: 'src',

    props: {
        src: String,
        icon: String,
        attributes: 'list',
        strokeAnimation: Boolean,
    },

    data: {
        strokeAnimation: false,
    },

    observe: [
        mutation({
            async handler() {
                const svg = await this.svg;
                if (svg) {
                    applyAttributes.call(this, svg);
                }
            },
            options: {
                attributes: true,
                attributeFilter: ['id', 'class', 'style'],
            },
        }),
    ],

    async connected() {
        if (includes(this.src, '#')) {
            [this.src, this.icon] = this.src.split('#', 2);
        }

        const svg = await this.svg;
        if (svg) {
            applyAttributes.call(this, svg);
            if (this.strokeAnimation) {
                applyAnimation(svg);
            }
        }
    },

    methods: {
        async getSvg() {
            if (isTag(this.$el, 'img') && !this.$el.complete && this.$el.loading === 'lazy') {
                await new Promise((resolve) => once(this.$el, 'load', resolve));
            }

            return parseSVG(await loadSVG(this.src), this.icon) || Promise.reject('SVG not found.');
        },
    },
};

function applyAttributes(el) {
    const { $el } = this;

    addClass(el, attr($el, 'class'), 'uk-svg');

    for (let i = 0; i < $el.style.length; i++) {
        const prop = $el.style[i];
        css(el, prop, css($el, prop));
    }

    for (const attribute in this.attributes) {
        const [prop, value] = this.attributes[attribute].split(':', 2);
        attr(el, prop, value);
    }

    if (!this.$el.id) {
        removeAttr(el, 'id');
    }
}

const loadSVG = memoize(async (src) => {
    if (src) {
        if (startsWith(src, 'data:')) {
            return decodeURIComponent(src.split(',', 2)[1]);
        } else {
            const response = await fetch(src);
            if (response.headers.get('Content-Type') === 'image/svg+xml') {
                return response.text();
            }
        }
    }

    return Promise.reject();
});

function applyAnimation(el) {
    const length = getMaxPathLength(el);

    if (length) {
        css(el, '--uk-animation-stroke', length);
    }
}
