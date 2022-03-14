import {
    append,
    attr,
    children,
    createEvent,
    css,
    data,
    escape,
    fragment,
    hasAttr,
    hasIntersectionObserver,
    includes,
    isArray,
    isEmpty,
    isTag,
    observeIntersection,
    parent,
    parseOptions,
    queryAll,
    removeAttr,
    startsWith,
    toFloat,
    toPx,
    trigger,
} from 'uikit-util';

const nativeLazyLoad = 'loading' in HTMLImageElement.prototype;

export default {
    args: 'dataSrc',

    props: {
        dataSrc: String,
        sources: String,
        offsetTop: String,
        offsetLeft: String,
        target: String,
        loading: String,
    },

    data: {
        dataSrc: '',
        sources: false,
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false,
        loading: 'lazy',
    },

    computed: {
        target: {
            get({ target }) {
                return [this.$el, ...queryAll(target, this.$el)];
            },

            watch() {
                this.$reset();
            },
        },
    },

    connected() {
        if (this.loading !== 'lazy' || !hasIntersectionObserver) {
            this.load();
            return;
        }

        if (nativeLazyLoad && isImg(this.$el)) {
            this.$el.loading = 'lazy';
            setSrcAttrs(this.$el);

            if (this.target.length === 1) {
                return;
            }
        }

        ensureSrcAttribute(this.$el);

        this.registerObserver(
            observeIntersection(
                this.target,
                (entries, observer) => {
                    this.load();
                    observer.disconnect();
                },
                {
                    rootMargin: `${toPx(this.offsetTop, 'height')}px ${toPx(
                        this.offsetLeft,
                        'width'
                    )}px`,
                }
            )
        );
    },

    disconnected() {
        if (this._data.image) {
            this._data.image.onload = '';
        }
    },

    update: {
        write(store) {
            if (!this.observer || isImg(this.$el)) {
                return false;
            }

            const srcset = data(this.$el, 'data-srcset');
            if (srcset && window.devicePixelRatio !== 1) {
                const bgSize = css(this.$el, 'backgroundSize');
                if (bgSize.match(/^(auto\s?)+$/) || toFloat(bgSize) === store.bgSize) {
                    store.bgSize = getSourceSize(srcset, data(this.$el, 'sizes'));
                    css(this.$el, 'backgroundSize', `${store.bgSize}px`);
                }
            }
        },

        events: ['resize'],
    },

    methods: {
        load() {
            if (this._data.image) {
                return this._data.image;
            }

            const image = isImg(this.$el)
                ? this.$el
                : getImageFromElement(this.$el, this.dataSrc, this.sources);

            removeAttr(image, 'loading');
            setSrcAttrs(this.$el, image.currentSrc);
            return (this._data.image = image);
        },
    },
};

function setSrcAttrs(el, src) {
    if (isImg(el)) {
        const parentNode = parent(el);
        const elements = isPicture(parentNode) ? children(parentNode) : [el];
        elements.forEach((el) => setSourceProps(el, el));
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
    srcProps.forEach((prop) => {
        const value = data(sourceEl, prop);
        if (value) {
            attr(targetEl, prop.replace(/^(data-)+/, ''), value);
        }
    });
}

function getImageFromElement(el, src, sources) {
    const img = new Image();

    wrapInPicture(img, sources);
    setSourceProps(el, img);
    img.onload = () => {
        setSrcAttrs(el, img.currentSrc);
    };
    attr(img, 'src', src);
    return img;
}

function wrapInPicture(img, sources) {
    sources = parseSources(sources);

    if (sources.length) {
        const picture = fragment('<picture>');
        for (const attrs of sources) {
            const source = fragment('<source>');
            attr(source, attrs);
            append(picture, source);
        }
        append(picture, img);
    }
}

function parseSources(sources) {
    if (!sources) {
        return [];
    }

    if (startsWith(sources, '[')) {
        try {
            sources = JSON.parse(sources);
        } catch (e) {
            sources = [];
        }
    } else {
        sources = parseOptions(sources);
    }

    if (!isArray(sources)) {
        sources = [sources];
    }

    return sources.filter((source) => !isEmpty(source));
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
              .replace(sizeRe, (size) => toPx(size))
              .replace(/ /g, '')
              .match(additionRe)
              .reduce((a, b) => a + +b, 0)
        : size;
}

const srcSetRe = /\s+\d+w\s*(?:,|$)/g;
function getSourceSize(srcset, sizes) {
    const srcSize = toPx(sizesToPixel(sizes));
    const descriptors = (srcset.match(srcSetRe) || []).map(toFloat).sort((a, b) => a - b);

    return descriptors.filter((size) => size >= srcSize)[0] || descriptors.pop() || '';
}

function ensureSrcAttribute(el) {
    if (isImg(el) && !hasAttr(el, 'src')) {
        attr(el, 'src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    }
}

function isPicture(el) {
    return isTag(el, 'picture');
}

function isImg(el) {
    return isTag(el, 'img');
}
