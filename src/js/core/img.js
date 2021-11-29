import {attr, children, createEvent, css, data, Dimensions, escape, getImage, includes, isUndefined, once, parent, queryAll, startsWith, toFloat, toPx, trigger} from 'uikit-util';

export default {

    props: {
        width: Number,
        height: Number,
        offsetTop: String,
        offsetLeft: String,
        target: String
    },

    data: {
        width: false,
        height: false,
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false
    },

    computed: {

        cacheKey() {
            return `${this.$name}.${data(this.$el, 'data-src')}`;
        },

        width({width, dataWidth}) {
            return width || dataWidth;
        },

        height({height, dataHeight}) {
            return height || dataHeight;
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
            setSrcAttrs(this.$el);
            return;
        }

        if (storage[this.cacheKey]) {
            setSrcAttrs(this.$el, storage[this.cacheKey]);
        } else if (isImg(this.$el) && this.width && this.height) {
            attr(this.$el, 'src', getPlaceholderImage(this.$el));
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

            if (isImg(this.$el)) {
                return false;
            }

            image && image.then(img => img && img.currentSrc !== '' && setSrcAttrs(this.$el, currentSrc(img)));

        },

        write(store) {

            const srcset = data(this.$el, 'data-srcset');
            if (srcset && window.devicePixelRatio !== 1) {

                const bgSize = css(this.$el, 'backgroundSize');
                if (bgSize.match(/^(auto\s?)+$/) || toFloat(bgSize) === store.bgSize) {
                    store.bgSize = getSourceSize(srcset, data(this.$el, 'sizes'));
                    css(this.$el, 'backgroundSize', `${store.bgSize}px`);
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

            this._data.image = getImageFromElement(this.$el).then(img => {

                setSrcAttrs(this.$el, currentSrc(img));
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

const srcProps = ['data-src', 'data-srcset', 'sizes'];
function setSrcAttrs(el, src) {

    const parentNode = parent(el);
    if (isImg(el)) {
        (isPicture(parentNode) ? children(parentNode) : [el]).forEach(el =>
            srcProps.forEach(prop => {
                const value = data(el, prop);
                if (value) {
                    attr(el, prop.replace(/^(data-)+/, ''), value);
                }
            })
        );
    } else if (src) {

        const change = !includes(el.style.backgroundImage, src);
        if (change) {
            css(el, 'backgroundImage', `url(${escape(src)})`);
            trigger(el, createEvent('load', false));
        }

    }

}

function getPlaceholderImage(el) {
    const sizes = data(el, 'sizes');
    let width = data(el, 'width');
    let height = data(el, 'height');

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

function getImageFromElement(el) {
    const parentNode = parent(el);
    if (!isPicture(parentNode)) {
        return getImage(...srcProps.map(prop => data(el, prop)));
    }

    return new Promise((resolve, reject) => {
        const picture = parentNode.cloneNode(true);
        once(picture, 'load error', e => e.type === 'error' ? reject(e) : resolve(e.target), true);
        setSrcAttrs(el);
    });
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

function isPicture(el) {
    return isA(el, 'PICTURE');
}

function isImg(el) {
    return isA(el, 'IMG');
}

function isA(el, tagName) {
    return el && el.tagName === tagName;
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
