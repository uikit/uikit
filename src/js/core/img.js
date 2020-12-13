import {createEvent, css, Dimensions, escape, getImage, includes, isUndefined, queryAll, startsWith, toFloat, toPx, trigger} from 'uikit-util';

export default {

    args: 'dataSrc',

    props: {
        dataSrc: String,
        dataSrcset: Boolean,
        sizes: String,
        width: Number,
        height: Number,
        offsetTop: String,
        offsetLeft: String,
        target: String
    },

    data: {
        dataSrc: '',
        dataSrcset: false,
        sizes: false,
        width: false,
        height: false,
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false
    },

    computed: {

        cacheKey({dataSrc}) {
            return `${this.$name}.${dataSrc}`;
        },

        width({width, dataWidth}) {
            return width || dataWidth;
        },

        height({height, dataHeight}) {
            return height || dataHeight;
        },

        sizes({sizes, dataSizes}) {
            return sizes || dataSizes;
        },

        isImg(_, $el) {
            return isImg($el);
        },

        target: {

            get({target}) {
                return [this.$el, ...queryAll(target, this.$el)];
            },

            watch() {
                this.observe();
            }

        },

        offsetTop({offsetTop}) {
            return toPx(offsetTop, 'height');
        },

        offsetLeft({offsetLeft}) {
            return toPx(offsetLeft, 'width');
        }

    },

    connected() {

        if (!window.IntersectionObserver) {
            setSrcAttrs(this.$el, this.dataSrc, this.dataSrcset, this.sizes);
            return;
        }

        if (storage[this.cacheKey]) {
            setSrcAttrs(this.$el, storage[this.cacheKey], this.dataSrcset, this.sizes);
        } else if (this.isImg && this.width && this.height) {
            setSrcAttrs(this.$el, getPlaceholderImage(this.width, this.height, this.sizes));
        }

        this.observer = new IntersectionObserver(this.load, {
            rootMargin: `${this.offsetTop}px ${this.offsetLeft}px`
        });

        requestAnimationFrame(this.observe);

    },

    disconnected() {
        this.observer && this.observer.disconnect();
    },

    update: {

        read({image}) {

            if (!this.observer) {
                return false;
            }

            if (!image && document.readyState === 'complete') {
                this.load(this.observer.takeRecords());
            }

            if (this.isImg) {
                return false;
            }

            image && image.then(img => img && img.currentSrc !== '' && setSrcAttrs(this.$el, currentSrc(img)));

        },

        write(data) {

            if (this.dataSrcset && window.devicePixelRatio !== 1) {

                const bgSize = css(this.$el, 'backgroundSize');
                if (bgSize.match(/^(auto\s?)+$/) || toFloat(bgSize) === data.bgSize) {
                    data.bgSize = getSourceSize(this.dataSrcset, this.sizes);
                    css(this.$el, 'backgroundSize', `${data.bgSize}px`);
                }

            }

        },

        events: ['resize']

    },

    methods: {

        load(entries) {

            // Old chromium based browsers (UC Browser) did not implement `isIntersecting`
            if (!entries.some(entry => isUndefined(entry.isIntersecting) || entry.isIntersecting)) {
                return;
            }

            this._data.image = getImage(this.dataSrc, this.dataSrcset, this.sizes).then(img => {

                setSrcAttrs(this.$el, currentSrc(img), img.srcset, img.sizes);
                storage[this.cacheKey] = currentSrc(img);
                return img;

            }, e => trigger(this.$el, new e.constructor(e.type, e)));

            this.observer.disconnect();
        },

        observe() {
            if (this._connected && !this._data.image) {
                this.target.forEach(el => this.observer.observe(el));
            }
        }

    }

};

function setSrcAttrs(el, src, srcset, sizes) {

    if (isImg(el)) {
        sizes && (el.sizes = sizes);
        srcset && (el.srcset = srcset);
        src && (el.src = src);
    } else if (src) {

        const change = !includes(el.style.backgroundImage, src);
        if (change) {
            css(el, 'backgroundImage', `url(${escape(src)})`);
            trigger(el, createEvent('load', false));
        }

    }

}

function getPlaceholderImage(width, height, sizes) {

    if (sizes) {
        ({width, height} = Dimensions.ratio({width, height}, 'width', toPx(sizesToPixel(sizes))));
    }

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;
}

const sizesRe = /\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;
function sizesToPixel(sizes) {
    let matches;

    sizesRe.lastIndex = 0;

    while ((matches = sizesRe.exec(sizes))) {
        if (!matches[1] || window.matchMedia(matches[1]).matches) {
            matches = evaluateSize(matches[2]);
            break;
        }
    }

    return matches || '100vw';
}

const sizeRe = /\d+(?:\w+|%)/g;
const additionRe = /[+-]?(\d+)/g;
function evaluateSize(size) {
    return startsWith(size, 'calc')
        ? size
            .slice(5, -1)
            .replace(sizeRe, size => toPx(size))
            .replace(/ /g, '')
            .match(additionRe)
            .reduce((a, b) => a + +b, 0)
        : size;
}

const srcSetRe = /\s+\d+w\s*(?:,|$)/g;
function getSourceSize(srcset, sizes) {
    const srcSize = toPx(sizesToPixel(sizes));
    const descriptors = (srcset.match(srcSetRe) || []).map(toFloat).sort((a, b) => a - b);

    return descriptors.filter(size => size >= srcSize)[0] || descriptors.pop() || '';
}

function isImg(el) {
    return el.tagName === 'IMG';
}

function currentSrc(el) {
    return el.currentSrc || el.src;
}

const key = '__test__';
let storage;

// workaround for Safari's private browsing mode and accessing sessionStorage in Blink
try {
    storage = window.sessionStorage || {};
    storage[key] = 1;
    delete storage[key];
} catch (e) {
    storage = {};
}
