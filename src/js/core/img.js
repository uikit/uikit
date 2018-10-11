import {createEvent, css, Dimensions, endsWith, getImage, height, includes, isInView, isNumeric, noop, queryAll, startsWith, toFloat, trigger, width} from 'uikit-util';

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

            if (image || !this.target.some(el => isInView(el, this.offsetTop, this.offsetLeft, true))) {

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

        write(data) {

            // Give placeholder images time to apply their dimensions
            if (!data.update) {
                this.$emit();
                return data.update = true;
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
        css(el, 'backgroundImage', `url(${src})`);
        if (change) {
            trigger(el, createEvent('load', false));
        }

    }

}

const sizesRe = /\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;
function getPlaceholderImage(width, height, sizes) {

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

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;
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
let storage;

// workaround for Safari's private browsing mode and accessing sessionStorage in Blink
try {
    storage = window.sessionStorage || {};
    storage[key] = 1;
    delete storage[key];
} catch (e) {
    storage = {};
}
