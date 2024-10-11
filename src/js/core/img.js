import {
    append,
    attr,
    children,
    createEvent,
    css,
    data,
    escape,
    fragment,
    includes,
    isArray,
    isEmpty,
    isTag,
    parent,
    queryAll,
    removeAttr,
    startsWith,
    trigger,
} from 'uikit-util';
import { intersection } from '../api/observables';
import { parseOptions } from '../api/options';

export default {
    args: 'dataSrc',

    props: {
        dataSrc: String,
        sources: String,
        margin: String,
        target: String,
        loading: String,
    },

    data: {
        dataSrc: '',
        sources: false,
        margin: '50%',
        target: false,
        loading: 'lazy',
    },

    connected() {
        if (this.loading !== 'lazy') {
            this.load();
        } else if (isImg(this.$el)) {
            this.$el.loading = 'lazy';
            setSrcAttrs(this.$el);
        }
    },

    disconnected() {
        if (this.img) {
            this.img.onload = '';
        }
        delete this.img;
    },

    observe: intersection({
        handler(entries, observer) {
            this.load();
            observer.disconnect();
        },
        options: ({ margin }) => ({ rootMargin: margin }),
        filter: ({ loading }) => loading === 'lazy',
        target: ({ $el, $props }) => ($props.target ? [$el, ...queryAll($props.target, $el)] : $el),
    }),

    methods: {
        load() {
            if (this.img) {
                return this.img;
            }

            const image = isImg(this.$el)
                ? this.$el
                : getImageFromElement(this.$el, this.dataSrc, this.sources);

            removeAttr(image, 'loading');
            setSrcAttrs(this.$el, image.currentSrc);
            return (this.img = image);
        },
    },
};

function setSrcAttrs(el, src) {
    if (isImg(el)) {
        const parentNode = parent(el);
        const elements = isTag(parentNode, 'picture') ? children(parentNode) : [el];
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
    for (const prop of srcProps) {
        const value = data(sourceEl, prop);
        if (value) {
            attr(targetEl, prop.replace(/data-/g, ''), value);
        }
    }
}

function getImageFromElement(el, src, sources) {
    const img = new Image();

    wrapInPicture(img, sources);
    setSourceProps(el, img);
    img.onload = () => setSrcAttrs(el, img.currentSrc);
    attr(img, 'src', src);
    return img;
}

export function wrapInPicture(img, sources) {
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

function isImg(el) {
    return isTag(el, 'img');
}
