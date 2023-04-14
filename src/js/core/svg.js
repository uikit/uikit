import Svg from '../mixin/svg';
import { getMaxPathLength } from '../util/svg';
import { mutation } from '../api/observables';
import {
    $,
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
            [this.src, this.icon] = this.src.split('#');
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
                return new Promise((resolve) =>
                    once(this.$el, 'load', () => resolve(this.getSvg()))
                );
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
            return decodeURIComponent(src.split(',')[1]);
        } else {
            return (await fetch(src)).text();
        }
    } else {
        return Promise.reject();
    }
});

function parseSVG(svg, icon) {
    if (icon && includes(svg, '<symbol')) {
        svg = parseSymbols(svg)[icon] || svg;
    }

    svg = $(svg.substr(svg.indexOf('<svg')));
    return svg?.hasChildNodes() && svg;
}

const symbolRe = /<symbol([^]*?id=(['"])(.+?)\2[^]*?<\/)symbol>/g;

const parseSymbols = memoize(function (svg) {
    const symbols = {};

    symbolRe.lastIndex = 0;

    let match;
    while ((match = symbolRe.exec(svg))) {
        symbols[match[3]] = `<svg ${match[1]}svg>`;
    }

    return symbols;
});

function applyAnimation(el) {
    const length = getMaxPathLength(el);

    if (length) {
        css(el, '--uk-animation-stroke', length);
    }
}
