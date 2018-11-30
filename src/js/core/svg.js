import {$, after, ajax, append, attr, includes, isString, isVoidElement, noop, Promise, remove, removeAttr, startsWith} from 'uikit-util';

const svgs = {};

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
        'class': String
    },

    data: {
        ratio: 1,
        id: false,
        exclude: ['ratio', 'src', 'icon'],
        'class': ''
    },

    connected() {

        this.class += ' uk-svg';

        if (!this.icon && includes(this.src, '#')) {

            const parts = this.src.split('#');

            if (parts.length > 1) {
                [this.src, this.icon] = parts;
            }
        }

        this.svg = this.getSvg().then(svg => {

            let el;

            if (isString(svg)) {

                if (this.icon && includes(svg, '<symbol')) {
                    svg = parseSymbols(svg, this.icon) || svg;
                }

                el = $(svg.substr(svg.indexOf('<svg')));

            } else {
                el = svg.cloneNode(true);
            }

            if (!el) {
                return Promise.reject('SVG not found.');
            }

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

            const src = this.icon || this.src;
            attr(el, 'data-svg', src);

            const root = this.$el;
            if (isVoidElement(root) || root.tagName === 'CANVAS') {

                attr(root, {hidden: true, id: null});

                const next = root.nextElementSibling;
                if (src === attr(next, 'data-svg')) {
                    el = next;
                } else {
                    after(root, el);
                }

            } else {

                const last = root.lastElementChild;
                if (src === attr(last, 'data-svg')) {
                    el = last;
                } else {
                    append(root, el);
                }

            }

            this.svgEl = el;

            return el;

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

            if (!this.src) {
                return Promise.reject();
            }

            if (svgs[this.src]) {
                return svgs[this.src];
            }

            svgs[this.src] = new Promise((resolve, reject) => {

                if (startsWith(this.src, 'data:')) {
                    resolve(decodeURIComponent(this.src.split(',')[1]));
                } else {

                    ajax(this.src).then(
                        xhr => resolve(xhr.response),
                        () => reject('SVG not found.')
                    );

                }

            });

            return svgs[this.src];

        }

    }

};

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
