import {attr, children, createEvent, css, data, escape, includes, isUndefined, parent, queryAll, startsWith, toFloat, toPx, trigger} from 'uikit-util';

export default {

    args: 'dataSrc',

    props: {
        dataSrc: String,
        offsetTop: String,
        offsetLeft: String,
        target: String
    },

    data: {
        dataSrc: '',
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false
    },

    computed: {

        target: {

            get({target}) {
                return [this.$el, ...queryAll(target, this.$el)];
            },

            watch() {
                this.observe();
            }

        }

    },

    connected() {

        if (!window.IntersectionObserver) {
            setSrcAttrs(this.$el, this.dataSrc);
            return;
        }

        const rootMargin = `${toPx(this.offsetTop, 'height')}px ${toPx(this.offsetLeft, 'width')}px`;
        this.observer = new IntersectionObserver(this.load, {rootMargin});
        this.observe();

    },

    disconnected() {
        this.observer && this.observer.disconnect();
    },

    update: {

        read({image}) {

            if (!this.observer || isImg(this.$el)) {
                return false;
            }

            setSrcAttrs(this.$el, image && image.currentSrc);

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

            if (this._data.image) {
                return this._data.image;
            }

            const image = isImg(this.$el) ? this.$el : getImageFromElement(this.$el, this.dataSrc);
            this._data.image = image;
            setSrcAttrs(this.$el, image.currentSrc || this.dataSrc);

            this.observer.disconnect();
        },

        observe() {
            if (this._connected && !this._data.image) {
                this.target.forEach(el => this.observer.observe(el));
            }
        }

    }

};

function setSrcAttrs(el, src) {

    if (isImg(el)) {

        const parentNode = parent(el);
        const elements = isPicture(parentNode) ? children(parentNode) : [el];
        elements.forEach(el => setSourceProps(el, el));
        src && attr(el, 'src', src);

    } else if (src) {

        const change = !includes(el.style.backgroundImage, src);
        if (change) {
            css(el, 'backgroundImage', `url(${escape(src)})`);
            trigger(el, createEvent('load', false));
        }

    }

}

const srcProps = ['data-src', 'data-srcset', 'sizes'];
function setSourceProps(sourceEl, targetEl) {
    srcProps.forEach(prop => {
        const value = data(sourceEl, prop);
        if (value) {
            attr(targetEl, prop.replace(/^(data-)+/, ''), value);
        }
    });
}

function getImageFromElement(el, src) {

    if (!src) {
        return false;
    }

    const img = new Image();
    setSourceProps(el, img);
    attr(img, 'src', src);
    return img;
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

function isPicture(el) {
    return isA(el, 'PICTURE');
}

function isImg(el) {
    return isA(el, 'IMG');
}

function isA(el, tagName) {
    return el && el.tagName === tagName;
}
