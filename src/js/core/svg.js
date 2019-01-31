import {$, $$, addClass, after, ajax, append, attr, css, includes, isIE, isString, isVoidElement, noop, Promise, remove, removeAttr, startsWith} from 'uikit-util';

export default {

    args: 'src',

    props: {
        id: String,
        icon: String,
        src: String,
        style: String,
        width: Number,
        height: Number,
        ratio: Number,
        'class': String,
        strokeAnimation: Boolean
    },

    data: {
        ratio: 1,
        id: false,
        exclude: ['ratio', 'src', 'icon'],
        'class': '',
        strokeAnimation: false
    },

    connected() {

        this.class += ' uk-svg';

        if (!this.icon && includes(this.src, '#')) {

            const parts = this.src.split('#');

            if (parts.length > 1) {
                [this.src, this.icon] = parts;
            }
        }

        this.svg = this.getSvg().then(el => {
            this.applyAttributes(el);
            this.svgEl = insertSVG(el, this.$el);

            if (this.strokeAnimation) {
                applyAnimation(this.svgEl);
            }

            return this.svgEl;
        }, noop);

    },

    disconnected() {

        if (isVoidElement(this.$el)) {
            attr(this.$el, {hidden: null, id: this.id || null});
        }

        if (this.svg) {
            this.svg.then(svg => (!this._connected || svg !== this.svgEl) && remove(svg), noop);
        }

        this.svg = this.svgEl = null;

    },

    methods: {

        getSvg() {
            return loadSVG(this.src).then(svg => {
                const el = parseSVG(svg, this.icon);

                if (!el) {
                    return Promise.reject('SVG not found.');
                }

                return el;
            });
        },

        applyAttributes(el) {

            let dimensions = attr(el, 'viewBox');

            if (dimensions) {
                dimensions = dimensions.split(' ');
                this.width = this.$props.width || dimensions[2];
                this.height = this.$props.height || dimensions[3];
            }

            this.width *= this.ratio;
            this.height *= this.ratio;

            for (const prop in this.$options.props) {
                if (this[prop] && !includes(this.exclude, prop)) {
                    attr(el, prop, this[prop]);
                }
            }

            if (!this.id) {
                removeAttr(el, 'id');
            }

            if (this.width && !this.height) {
                removeAttr(el, 'height');
            }

            if (this.height && !this.width) {
                removeAttr(el, 'width');
            }

            attr(el, 'data-svg', this.icon || this.src);

        }

    }

};


const svgs = {};

function loadSVG(src) {

    if (svgs[src]) {
        return svgs[src];
    }

    return svgs[src] = new Promise((resolve, reject) => {

        if (!src) {
            reject();
            return;
        }

        if (startsWith(src, 'data:')) {
            resolve(decodeURIComponent(src.split(',')[1]));
        } else {

            ajax(src).then(
                xhr => resolve(xhr.response),
                () => reject('SVG not found.')
            );

        }

    });
}

function parseSVG(svg, icon) {
    if (isString(svg)) {

        if (icon && includes(svg, '<symbol')) {
            svg = parseSymbols(svg, icon) || svg;
        }

        return $(svg.substr(svg.indexOf('<svg')));

    } else {
        return svg;
    }
}

const symbolRe = /<symbol(.*?id=(['"])(.*?)\2[^]*?<\/)symbol>/g;
const symbols = {};

function parseSymbols(svg, icon) {

    if (!symbols[svg]) {

        symbols[svg] = {};

        let match;
        while ((match = symbolRe.exec(svg))) {
            symbols[svg][match[3]] = `<svg xmlns="http://www.w3.org/2000/svg"${match[1]}svg>`;
        }

        symbolRe.lastIndex = 0;

    }

    return symbols[svg][icon];
}

function applyAnimation(el) {
    const length = getMaxPathLength(el);

    if (!length || isIE) {
        return;
    }

    css(el, {
        strokeDasharray: length,
        strokeDashoffset: length
    });

    requestAnimationFrame(() => addClass(el, 'uk-transition-stroke'));
}

export function getMaxPathLength(el) {
    return Math.ceil($$('*', el).concat(el).reduce((length, stroke) => stroke.getTotalLength
        ? Math.max(length, stroke.getTotalLength())
        : length, 0));
}

function insertSVG(el, root) {
    if (isVoidElement(root) || root.tagName === 'CANVAS') {

        attr(root, {hidden: true, id: null});

        const next = root.nextElementSibling;
        return equals(el, next)
            ? next
            : after(root, el);

    } else {

        const last = root.lastElementChild;
        return equals(el, last)
            ? last
            : append(root, el);

    }
}

function equals(el, other) {
    return attr(el, 'data-svg') === attr(other, 'data-svg');
}
