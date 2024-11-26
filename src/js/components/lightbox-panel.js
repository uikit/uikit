import {
    $,
    $$,
    Transition,
    addClass,
    append,
    attr,
    fragment,
    getIndex,
    html,
    isTag,
    matches,
    on,
    parent,
    pick,
    pointerDown,
    pointerMove,
    remove,
    removeClass,
    toggleClass,
    trigger,
    wrapAll,
} from 'uikit-util';
import { wrapInPicture } from '../core/img';
import Modal from '../mixin/modal';
import Slideshow from '../mixin/slideshow';
import { keyMap } from '../util/keys';
import Animations from './internal/lightbox-animations';

export default {
    i18n: {
        counter: '%s / %s',
    },

    mixins: [Modal, Slideshow],

    functional: true,

    props: {
        counter: Boolean,
        preload: Number,
        nav: Boolean,
        slidenav: Boolean,
        delayControls: Number,
        videoAutoplay: Boolean,
        template: String,
    },

    data: () => ({
        counter: false,
        preload: 1,
        nav: false,
        slidenav: true,
        delayControls: 3000,
        videoAutoplay: false,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        clsFit: 'uk-lightbox-items-fit',
        clsZoom: 'uk-lightbox-zoom',
        attrItem: 'uk-lightbox-item',
        selList: '.uk-lightbox-items',
        selClose: '.uk-close-large',
        selNav: '.uk-lightbox-thumbnav, .uk-lightbox-dotnav',
        selCaption: '.uk-lightbox-caption',
        selCounter: '.uk-lightbox-counter',
        pauseOnHover: false,
        velocity: 2,
        Animations,
        template: `<div class="uk-lightbox uk-overflow-hidden">
                        <div class="uk-lightbox-items"></div>
                        <div class="uk-position-top-right uk-position-small uk-transition-fade" uk-inverse>
                            <button class="uk-lightbox-close uk-close-large" type="button" uk-close></button>
                        </div>
                        <div class="uk-lightbox-slidenav uk-position-center-left uk-position-medium uk-transition-fade" uk-inverse>
                            <a href uk-slidenav-previous uk-lightbox-item="previous"></a>
                        </div>
                        <div class="uk-lightbox-slidenav uk-position-center-right uk-position-medium uk-transition-fade" uk-inverse>
                            <a href uk-slidenav-next uk-lightbox-item="next"></a>
                        </div>
                        <div class="uk-position-center-right uk-position-medium uk-transition-fade" uk-inverse style="max-height: 90vh; overflow: auto;">
                            <ul class="uk-lightbox-thumbnav uk-lightbox-thumbnav-vertical uk-thumbnav uk-thumbnav-vertical"></ul>
                            <ul class="uk-lightbox-dotnav uk-dotnav uk-dotnav-vertical"></ul>
                        </div>
                        <div class="uk-lightbox-counter uk-text-large uk-position-top-left uk-position-small uk-transition-fade" uk-inverse></div>
                        <div class="uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div>
                    </div>`,
    }),

    created() {
        let $el = $(this.template);

        if (isTag($el, 'template')) {
            $el = fragment(html($el));
        }

        const list = $(this.selList, $el);
        const navType = this.$props.nav;

        remove($$(this.selNav, $el).filter((el) => !matches(el, `.uk-${navType}`)));

        for (const [i, item] of this.items.entries()) {
            append(list, '<div>');
            if (navType === 'thumbnav') {
                wrapAll(
                    toThumbnavItem(item, this.videoAutoplay),
                    append($(this.selNav, $el), `<li uk-lightbox-item="${i}"><a href></a></li>`),
                );
            }
        }

        if (!this.slidenav) {
            remove($$('.uk-lightbox-slidenav', $el));
        }

        if (!this.counter) {
            remove($(this.selCounter, $el));
        }

        addClass(list, this.clsFit);

        const close = $('[uk-close]', $el);
        const closeLabel = this.t('close');
        if (close && closeLabel) {
            close.dataset.i18n = JSON.stringify({ label: closeLabel });
        }

        this.$mount(append(this.container, $el));
    },

    events: [
        {
            name: 'click',

            self: true,

            filter: ({ bgClose }) => bgClose,

            delegate: ({ selList }) => `${selList} > *`,

            handler(e) {
                if (!e.defaultPrevented) {
                    this.hide();
                }
            },
        },

        {
            name: 'click',

            self: true,

            delegate: ({ clsZoom }) => `.${clsZoom}`,

            handler(e) {
                if (!e.defaultPrevented) {
                    toggleClass(this.list, this.clsFit);
                }
            },
        },

        {
            name: `${pointerMove} ${pointerDown} keydown`,

            filter: ({ delayControls }) => delayControls,

            handler() {
                this.showControls();
            },
        },

        {
            name: 'shown',

            self: true,

            handler() {
                this.showControls();
            },
        },

        {
            name: 'hide',

            self: true,

            handler() {
                this.hideControls();

                removeClass(this.slides, this.clsActive);
                Transition.stop(this.slides);
            },
        },

        {
            name: 'hidden',

            self: true,

            handler() {
                this.$destroy(true);
            },
        },

        {
            name: 'keyup',

            el: () => document,

            handler({ keyCode }) {
                if (!this.isToggled(this.$el) || !this.draggable) {
                    return;
                }

                let i = -1;

                if (keyCode === keyMap.LEFT) {
                    i = 'previous';
                } else if (keyCode === keyMap.RIGHT) {
                    i = 'next';
                } else if (keyCode === keyMap.HOME) {
                    i = 0;
                } else if (keyCode === keyMap.END) {
                    i = 'last';
                }

                if (~i) {
                    this.show(i);
                }
            },
        },

        {
            name: 'beforeitemshow',

            handler(e) {
                html($(this.selCaption, this.$el), this.getItem().caption || '');
                html(
                    $(this.selCounter, this.$el),
                    this.t('counter', this.index + 1, this.slides.length),
                );

                for (let j = -this.preload; j <= this.preload; j++) {
                    this.loadItem(this.index + j);
                }

                if (this.isToggled()) {
                    return;
                }

                this.draggable = false;

                e.preventDefault();

                this.toggleElement(this.$el, true, false);

                this.animation = Animations.scale;
                removeClass(e.target, this.clsActive);
                this.stack.splice(1, 0, this.index);
            },
        },

        {
            name: 'itemshown',

            handler() {
                this.draggable = this.$props.draggable;
            },
        },

        {
            name: 'itemload',

            async handler(_, item) {
                const { source: src, type, attrs = {} } = item;

                this.setItem(item, '<span uk-spinner uk-inverse></span>');

                if (!src) {
                    return;
                }

                let matches;
                const iframeAttrs = {
                    allowfullscreen: '',
                    style: 'max-width: 100%; box-sizing: border-box;',
                    'uk-responsive': '',
                    'uk-video': `${Boolean(this.videoAutoplay)}`,
                };

                // Image
                if (type === 'image' || isImage(src)) {
                    const img = createEl('img');

                    wrapInPicture(img, item.sources);
                    attr(img, {
                        src,
                        ...pick(item, ['alt', 'srcset', 'sizes']),
                        ...attrs,
                    });

                    on(img, 'load', () => this.setItem(item, parent(img) || img));
                    on(img, 'error', () => this.setError(item));

                    // Video
                } else if (type === 'video' || isVideo(src)) {
                    const inline = this.videoAutoplay === 'inline';
                    const video = createEl('video', {
                        src,
                        playsinline: '',
                        controls: inline ? null : '',
                        loop: inline ? '' : null,
                        poster: this.videoAutoplay ? null : item.poster,
                        'uk-video': inline ? 'automute: true' : Boolean(this.videoAutoplay),
                        ...attrs,
                    });

                    on(video, 'loadedmetadata', () => this.setItem(item, video));
                    on(video, 'error', () => this.setError(item));

                    // Iframe
                } else if (type === 'iframe' || src.match(/\.(html|php)($|\?)/i)) {
                    this.setItem(
                        item,
                        createEl('iframe', {
                            src,
                            allowfullscreen: '',
                            class: 'uk-lightbox-iframe',
                            ...attrs,
                        }),
                    );

                    // YouTube
                } else if (
                    (matches = src.match(
                        /\/\/(?:.*?youtube(-nocookie)?\..*?(?:[?&]v=|\/shorts\/)|youtu\.be\/)([\w-]{11})[&?]?(.*)?/,
                    ))
                ) {
                    this.setItem(
                        item,
                        createEl('iframe', {
                            src: `https://www.youtube${matches[1] || ''}.com/embed/${matches[2]}${
                                matches[3] ? `?${matches[3]}` : ''
                            }`,
                            width: 1920,
                            height: 1080,
                            ...iframeAttrs,
                            ...attrs,
                        }),
                    );

                    // Vimeo
                } else if ((matches = src.match(/\/\/.*?vimeo\.[a-z]+\/(\d+)[&?]?(.*)?/))) {
                    try {
                        const { height, width } = await (
                            await fetch(
                                `https://vimeo.com/api/oembed.json?maxwidth=1920&url=${encodeURI(
                                    src,
                                )}`,
                                { credentials: 'omit' },
                            )
                        ).json();

                        this.setItem(
                            item,
                            createEl('iframe', {
                                src: `https://player.vimeo.com/video/${matches[1]}${
                                    matches[2] ? `?${matches[2]}` : ''
                                }`,
                                width,
                                height,
                                ...iframeAttrs,
                                ...attrs,
                            }),
                        );
                    } catch (e) {
                        this.setError(item);
                    }
                }
            },
        },

        {
            name: 'itemloaded',
            handler() {
                this.$emit('resize');
            },
        },
    ],

    update: {
        read() {
            for (const media of $$(`${this.selList} :not([controls]):is(img,video)`, this.$el)) {
                toggleClass(
                    media,
                    this.clsZoom,
                    (media.naturalHeight || media.videoHeight) - this.$el.offsetHeight >
                        Math.max(
                            0,
                            (media.naturalWidth || media.videoWidth) - this.$el.offsetWidth,
                        ),
                );
            }
        },

        events: ['resize'],
    },

    methods: {
        loadItem(index = this.index) {
            const item = this.getItem(index);

            if (!this.getSlide(item).childElementCount) {
                trigger(this.$el, 'itemload', [item]);
            }
        },

        getItem(index = this.index) {
            return this.items[getIndex(index, this.slides)];
        },

        setItem(item, content) {
            trigger(this.$el, 'itemloaded', [this, html(this.getSlide(item), content)]);
        },

        getSlide(item) {
            return this.slides[this.items.indexOf(item)];
        },

        setError(item) {
            this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2" uk-inverse></span>');
        },

        showControls() {
            clearTimeout(this.controlsTimer);
            this.controlsTimer =
                this.delayControls && setTimeout(this.hideControls, this.delayControls);

            addClass(this.$el, 'uk-active', 'uk-transition-active');
        },

        hideControls() {
            removeClass(this.$el, 'uk-active', 'uk-transition-active');
        },
    },
};

function createEl(tag, attrs) {
    const el = fragment(`<${tag}>`);
    attr(el, attrs);
    return el;
}

function toThumbnavItem(item, videoAutoplay) {
    const el =
        item.poster || (item.thumb && (item.type === 'image' || isImage(item.thumb)))
            ? createEl('img', { src: item.poster || item.thumb, alt: '' })
            : item.thumb && (item.type === 'video' || isVideo(item.thumb))
              ? createEl('video', {
                    src: item.thumb,
                    loop: '',
                    playsinline: '',
                    'uk-video': `autoplay: ${Boolean(videoAutoplay)}; automute: true`,
                })
              : createEl('canvas');

    if (item.thumbRatio) {
        el.style.aspectRatio = item.thumbRatio;
    }

    return el;
}

function isImage(src) {
    return src?.match(/\.(avif|jpe?g|jfif|a?png|gif|svg|webp)($|\?)/i);
}

function isVideo(src) {
    return src?.match(/\.(mp4|webm|ogv)($|\?)/i);
}
