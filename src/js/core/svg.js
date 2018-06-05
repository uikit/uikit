import {$, after, ajax, append, attr, includes, isString, isVoidElement, noop, Promise, remove, removeAttr, startsWith} from 'uikit-util';

const svgs = {};

export default {

    attrs: true,

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

            // Width and height definition priority:
            // #1 tag sizes
            // #2 svg viewport sizes
            // #3 svg viewbox sizes 

            let svgViewportWidth = attr(el, 'width') ;
            let svgViewportHeight = attr(el, 'height') ;
            let svgViewbox = attr(el, 'viewBox');
            if (svgViewbox) {
                svgViewbox = svgViewbox.split(' ');
                let svgViewboxWidth = svgViewbox[2] - svgViewbox[0];
                let svgViewboxHeight = svgViewbox[3] - svgViewbox[1];
            }

            this$1.width = this$1.$props.width || svgViewportWidth || svgViewboxWidth;
            this$1.height = this$1.$props.width || svgViewportHeight || svgViewboxHeight;
            
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

            const root = this.$el;
            if (isVoidElement(root) || root.tagName === 'CANVAS') {

                attr(root, {hidden: true, id: null});

                const next = root.nextElementSibling;
                if (next && el.isEqualNode(next)) {
                    el = next;
                } else {
                    after(root, el);
                }

            } else {

                const last = root.lastElementChild;
                if (last && el.isEqualNode(last)) {
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
