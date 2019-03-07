import {$, $$, after, ajax, append, attr, includes, isVisible, isVoidElement, noop, Promise, remove, removeAttr, startsWith} from 'uikit-util';

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
        'class': String,
        strokeAnimation: Boolean,
        attributes: 'list'
    },

    data: {
        ratio: 1,
        include: ['style', 'class'],
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
            return this.svgEl = insertSVG(el, this.$el);
        }, noop);

    },

    disconnected() {

        if (isVoidElement(this.$el)) {
            attr(this.$el, 'hidden', null);
        }

        if (this.svg) {
            this.svg.then(svg => (!this._connected || svg !== this.svgEl) && remove(svg), noop);
        }

        this.svg = this.svgEl = null;

    },

    update: {

        read() {
            return !!(this.strokeAnimation && this.svgEl && isVisible(this.svgEl));
        },

        write() {
            applyAnimation(this.svgEl);
        },

        type: ['resize']

    },

    methods: {

        getSvg() {
            return loadSVG(this.src).then(svg =>
                parseSVG(svg, this.icon) || Promise.reject('SVG not found.')
            );
        },

        applyAttributes(el) {

            for (const prop in this.$options.props) {
                if (this[prop] && includes(this.include, prop)) {
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
            let dimensions = [this.width, this.height];

            if (!dimensions.some(val => val)) {
                dimensions = props.map(prop => attr(el, prop));
            }

            const viewBox = attr(el, 'viewBox');
            if (viewBox && !dimensions.some(val => val)) {
                dimensions = viewBox.split(' ').slice(2);
            }

            dimensions.forEach((val, i) => {
                val = (val | 0) * this.ratio;
                val && attr(el, props[i], val);

                if (val && !dimensions[i ^ 1]) {
                    removeAttr(el, props[i ^ 1]);
                }
            });

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

    if (icon && includes(svg, '<symbol')) {
        svg = parseSymbols(svg, icon) || svg;
    }

    svg = $(svg.substr(svg.indexOf('<svg')));
    return svg && svg.hasChildNodes() && svg;
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

    if (length) {
        el.style.setProperty('--uk-animation-stroke', length);
    }

}

export function getMaxPathLength(el) {
    return Math.ceil(Math.max(...$$('[stroke]', el).map(stroke =>
        stroke.getTotalLength && stroke.getTotalLength() || 0
    ).concat([0])));
}

function insertSVG(el, root) {
    if (isVoidElement(root) || root.tagName === 'CANVAS') {

        attr(root, 'hidden', true);

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
