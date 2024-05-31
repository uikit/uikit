import {
    $,
    addClass,
    append,
    attr,
    fragment,
    getIndex,
    html,
    on,
    pointerDown,
    pointerMove,
    removeClass,
    toggleClass,
    Transition,
    trigger,
} from 'uikit-util';
import Modal from '../mixin/modal';
import Slideshow from '../mixin/slideshow';
import { keyMap } from '../util/keys';
import Animations from './internal/lightbox-animations';

export default {
    mixins: [Modal, Slideshow],

    functional: true,

    props: {
        delayControls: Number,
        preload: Number,
        videoAutoplay: Boolean,
        template: String,
    },

    data: () => ({
        preload: 1,
        videoAutoplay: false,
        delayControls: 3000,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        clsFit: 'uk-lightbox-items-fit',
        selList: '.uk-lightbox-items',
        attrItem: 'uk-lightbox-item',
        selClose: '.uk-close-large',
        selNav: '.uk-lightbox-nav',
        selCaption: '.uk-lightbox-caption',
        pauseOnHover: false,
        velocity: 2,
        Animations,
        template: `<div class="uk-lightbox uk-overflow-hidden">
                        <div class="uk-lightbox-items"></div>
                        <button class="uk-lightbox-close uk-close-large uk-position-top-right uk-position-small uk-transition-fade" type="button" uk-close></button>
                        <a class="uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade" href uk-slidenav-previous uk-lightbox-item="previous"></a>
                        <a class="uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade" href uk-slidenav-next uk-lightbox-item="next"></a>
                        <ul class="uk-lightbox-nav uk-position-center-right uk-position-medium uk-thumbnav uk-thumbnav-vertical" uk-inverse uk-toggle="cls: uk-position-center-right uk-position-bottom-center uk-thumbnav-vertical; mode: media; media: @s"></ul>
                        <div class="uk-lightbox-count uk-text-large uk-position-top-left uk-position-small uk-transition-fade"></div>
                        <div class="uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div>
                    </div>`,
    }),

    created() {
        const $el = $(this.template);
        const list = $(this.selList, $el);
        this.items.forEach(() => append(list, '<div>'));

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

            delegate: ({ selList }) => `${selList} > * > :is(img,video)`,

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
                if (this.isToggled()) {
                    return;
                }

                this.draggable = false;

                e.preventDefault();

                this.toggleElement(this.$el, true, false);

                this.animation = Animations['scale'];
                removeClass(e.target, this.clsActive);
                this.stack.splice(1, 0, this.index);
            },
        },

        {
            name: 'itemshow',

            handler() {
                html($(this.selCaption, this.$el), this.getItem().caption || '');

                for (let j = -this.preload; j <= this.preload; j++) {
                    this.loadItem(this.index + j);
                }
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
                const { source: src, type, alt = '', poster, attrs = {} } = item;

                this.setItem(item, '<span uk-spinner></span>');

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
                if (
                    type === 'image' ||
                    src.match(/\.(avif|jpe?g|jfif|a?png|gif|svg|webp)($|\?)/i)
                ) {
                    const img = createEl('img', { src, alt, ...attrs });
                    on(img, 'load', () => this.setItem(item, img));
                    on(img, 'error', () => this.setError(item));

                    // Video
                } else if (type === 'video' || src.match(/\.(mp4|webm|ogv)($|\?)/i)) {
                    const inline = this.videoAutoplay === 'inline';
                    const video = createEl('video', {
                        src,
                        poster,
                        controls: inline ? null : '',
                        muted: inline ? '' : null,
                        playsinline: '',
                        'uk-video': `${Boolean(this.videoAutoplay)}`,
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
    ],

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
            this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
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
