import {css, Dimensions, endsWith, getImage, height, isInView, isNumeric, noop, queryAll, startsWith, toFloat, width} from 'uikit-util';

export default {

    attrs: true,

    props: {
        dataSrc: String,
        dataSrcset: Boolean,
        dataSizes: Boolean,
        sizes: String,
        width: Number,
        height: Number,
        dataWidth: Number,
        dataHeight: Number,
        offsetTop: String,
        offsetLeft: String,
        target: String
    },

    data: {
        dataSrc: '',
        dataSrcset: false,
        dataSizes: false,
        sizes: false,
        width: false,
        height: false,
        offsetTop: '50vh',
        offsetLeft: 0,
        loaded: false,
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

        this.loaded = false;

        if (storage[this.cacheKey] || !this.width || !this.height) {
            setSrcAttrs(this.$el, storage[this.cacheKey] || this.dataSrc, this.dataSrcset, this.sizes);
        } else if (this.isImg) {
            setSrcAttrs(this.$el, getPlaceholderImage(this.width, this.height, this.sizes));
        }

    },

    update: [

        {

            read({image}) {

                if (image
                    || !this.loaded && this.isImg
                    || storage[this.cacheKey] && this.isImg
                    || !this.target.some(el => isInView(el, this.offsetTop, this.offsetLeft, true))
                ) {

                    if (!this.isImg && image) {
                        image.then(img => img && setSrcAttrs(this.$el, currentSrc(img)));
                    }

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

            events: ['scroll', 'load', 'resize']

        }

    ],

    events: {

        load() {
            this.loaded = true;
        }

    }

};

function setSrcAttrs(el, src, srcset, sizes) {

    if (isImg(el)) {
        src && (el.src = src);
        srcset && (el.srcset = srcset);
        sizes && (el.sizes = sizes);
    } else {
        src && css(el, 'backgroundImage', `url(${src})`);
    }

}

const urlCache = {};
const sizesRe = /\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;
function getPlaceholderImage(width, height, sizes, color = 'transparent') {

    if (sizes) {
        let matches;

        while ((matches = sizesRe.exec(sizes))) {
            if (!matches[1] || window.matchMedia(matches[1]).matches) {
                matches = evaluateSize(matches[2]);
                break;
            }
        }

        sizesRe.lastIndex = 0;

        ({width, height} = Dimensions.ratio({width, height}, 'width', toPx(matches || '100vw')));

    }

    const key = `${width}.${height}.${color}`;
    if (urlCache[key]) {
        return urlCache[key];
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);

    return urlCache[key] = canvas.toDataURL('image/png');
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

let storage = window.sessionStorage || {};

// workaround for Safari's private browsing mode
try {
    storage[key] = 1;
    delete storage[key];
} catch (e) {
    storage = {};
}
