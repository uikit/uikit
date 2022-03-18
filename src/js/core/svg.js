import {
    $,
    $$,
    after,
    append,
    attr,
    includes,
    isTag,
    isVoidElement,
    memoize,
    noop,
    observeIntersection,
    once,
    remove,
    removeAttr,
    startsWith,
    toFloat,
} from 'uikit-util';

export default {
    args: 'src',

    props: {
        id: Boolean,
        icon: String,
        src: String,
        style: String,
        width: Number,
        height: Number,
        ratio: Number,
        class: String,
        strokeAnimation: Boolean,
        focusable: Boolean, // IE 11
        attributes: 'list',
    },

    data: {
        ratio: 1,
        include: ['style', 'class', 'focusable'],
        class: '',
        strokeAnimation: false,
    },

    beforeConnect() {
        this.class += ' uk-svg';
    },

    connected() {
        if (!this.icon && includes(this.src, '#')) {
            [this.src, this.icon] = this.src.split('#');
        }

        this.svg = this.getSvg().then((el) => {
            if (this._connected) {
                const svg = insertSVG(el, this.$el);

                if (this.svgEl && svg !== this.svgEl) {
                    remove(this.svgEl);
                }

                this.applyAttributes(svg, el);

                return (this.svgEl = svg);
            }
        }, noop);

        if (this.strokeAnimation) {
            this.svg.then((el) => {
                if (this._connected) {
                    applyAnimation(el);
                    this.registerObserver(
                        observeIntersection(el, (records, observer) => {
                            applyAnimation(el);
                            observer.disconnect();
                        })
                    );
                }
            });
        }
    },

    disconnected() {
        this.svg.then((svg) => {
            if (this._connected) {
                return;
            }

            if (isVoidElement(this.$el)) {
                this.$el.hidden = false;
            }

            remove(svg);
            this.svgEl = null;
        });

        this.svg = null;
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

        applyAttributes(el, ref) {
            for (const prop in this.$options.props) {
                if (includes(this.include, prop) && prop in this) {
                    attr(el, prop, this[prop]);
                }
            }

            for (const attribute in this.attributes) {
                const [prop, value] = this.attributes[attribute].split(':', 2);
                attr(el, prop, value);
            }

            if (!this.id) {
                removeAttr(el, 'id');
            }

            const props = ['width', 'height'];
            let dimensions = props.map((prop) => this[prop]);

            if (!dimensions.some((val) => val)) {
                dimensions = props.map((prop) => attr(ref, prop));
            }

            const viewBox = attr(ref, 'viewBox');
            if (viewBox && !dimensions.some((val) => val)) {
                dimensions = viewBox.split(' ').slice(2);
            }

            dimensions.forEach((val, i) => attr(el, props[i], toFloat(val) * this.ratio || null));
        },
    },
};

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
        svg = parseSymbols(svg, icon) || svg;
    }

    svg = $(svg.substr(svg.indexOf('<svg')));
    return svg?.hasChildNodes() && svg;
}

const symbolRe = /<symbol([^]*?id=(['"])(.+?)\2[^]*?<\/)symbol>/g;
const symbols = {};

function parseSymbols(svg, icon) {
    if (!symbols[svg]) {
        symbols[svg] = {};

        symbolRe.lastIndex = 0;

        let match;
        while ((match = symbolRe.exec(svg))) {
            symbols[svg][match[3]] = `<svg xmlns="http://www.w3.org/2000/svg"${match[1]}svg>`;
        }
    }

    return symbols[svg][icon];
}

function applyAnimation(el) {
    const length = getMaxPathLength(el);

    if (length) {
        el.style.setProperty('--uk-animation-stroke', length);
    }
}

export function getMaxPathLength(el) {
    return Math.ceil(
        Math.max(
            0,
            ...$$('[stroke]', el).map((stroke) => {
                try {
                    return stroke.getTotalLength();
                } catch (e) {
                    return 0;
                }
            })
        )
    );
}

function insertSVG(el, root) {
    if (isVoidElement(root) || isTag(root, 'canvas')) {
        root.hidden = true;

        const next = root.nextElementSibling;
        return equals(el, next) ? next : after(root, el);
    }

    const last = root.lastElementChild;
    return equals(el, last) ? last : append(root, el);
}

function equals(el, other) {
    return isTag(el, 'svg') && isTag(other, 'svg') && innerHTML(el) === innerHTML(other);
}

function innerHTML(el) {
    return (
        el.innerHTML ||
        new XMLSerializer().serializeToString(el).replace(/<svg.*?>(.*?)<\/svg>/g, '$1')
    ).replace(/\s/g, '');
}
