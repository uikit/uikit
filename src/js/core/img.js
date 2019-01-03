import {createEvent, css, Dimensions, endsWith, getImage, height, includes, isInView, isNumeric, isVisible, noop, queryAll, startsWith, toFloat, trigger, width} from 'uikit-util';

export default {

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
        offsetLeft: 0,
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

        target({target}) {
            return [this.$el].concat(queryAll(target, this.$el));
        },

        offsetTop({offsetTop}) {
            return toPx(offsetTop, 'height');
        },

        offsetLeft({offsetLeft}) {
            return toPx(offsetLeft, 'width');
        }

    },

    connected() {

        if (storage[this.cacheKey]) {
            setSrcAttrs(this.$el, storage[this.cacheKey] || this.dataSrc, this.dataSrcset, this.sizes);
        } else if (this.isImg && this.width && this.height) {
            setSrcAttrs(this.$el, getPlaceholderImage(this.width, this.height, this.sizes));
        }

    },

    update: {

        read({update, image}) {

            if (!update) {
                return;
            }

            if (image || !this.target.some(el => isInView(el, this.offsetTop, this.offsetLeft))) {

                if (!this.isImg && image) {
                    image.then(img => img && img.currentSrc !== '' && setSrcAttrs(this.$el, currentSrc(img)));
                }

                return;
            }

            if (this.$el.src && isVisible(this.$el) && !height(this.$el)) {
                return;
            }

            return {
                image: getImage(this.dataSrc, this.dataSrcset, this.sizes).then(img => {

                    setSrcAttrs(this.$el, currentSrc(img), img.srcset, img.sizes);
                    storage[this.cacheKey] = currentSrc(img);
                    return img;

                }, noop)
            };

        },

        write(data) {

            // Give placeholder images time to apply their dimensions
            if (!data.update) {
                this.$emit();
                return data.update = true;
            }

            if (!this.isImg && this.dataSrcset && window.devicePixelRatio !== 1) {

                const bgSize = css(this.$el, 'backgroundSize');
                if (bgSize === 'auto' || toFloat(bgSize) === data.bgSize) {
                    data.bgSize = getSourceSize(this.dataSrcset, this.sizes);
                    css(this.$el, 'backgroundSize', `${data.bgSize}px`);
                }

            }

        },

        events: ['scroll', 'load', 'resize']

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
            css(el, 'backgroundImage', `url(${src})`);
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

    return matches;
}

const sizeRe = /\d+(?:\w+|%)/g;
const additionRe = /[+-]?(\d+)/g;
function evaluateSize(size) {
    return startsWith(size, 'calc')
        ? size
            .substring(5, size.length - 1)
            .replace(sizeRe, size => toPx(size))
            .replace(/ /g, '')
            .match(additionRe)
            .reduce((a, b) => a + +b, 0)
        : size;
}

function toPx(value, property = 'width', element = window) {
    value = value || '100vw';
    return isNumeric(value)
        ? +value
        : endsWith(value, 'vw')
            ? percent(element, 'width', value)
            : endsWith(value, 'vh')
                ? percent(element, 'height', value)
                : endsWith(value, '%')
                    ? percent(element, property, value)
                    : toFloat(value);
}

const srcSetRe = /\s+\d+w\s*,/g;
function getSourceSize(srcset, sizes) {
    const srcSize = toPx(sizesToPixel(sizes));
    const descriptors = (srcset.match(srcSetRe) || []).map(toFloat).sort((a, b) => a - b);

    return descriptors.filter(size => size > srcSize)[0] || descriptors[0] || '';
}

const dimensions = {height, width};
function percent(element, property, value) {
    return dimensions[property](element) * toFloat(value) / 100;
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
