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
    inBrowser,
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
    toPx,
    trigger,
} from 'uikit-util';

const nativeLazyLoad = inBrowser && 'loading' in HTMLImageElement.prototype;

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

    connected() {
        if (this.loading !== 'lazy') {
            this.load();
            return;
        }

        const target = [this.$el, ...queryAll(this.$props.target, this.$el)];

        if (nativeLazyLoad && isImg(this.$el)) {
            this.$el.loading = 'lazy';
            setSrcAttrs(this.$el);

            if (target.length === 1) {
                return;
            }
        }

        ensureSrcAttribute(this.$el);

        this.registerObserver(
            observeIntersection(
                target,
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
