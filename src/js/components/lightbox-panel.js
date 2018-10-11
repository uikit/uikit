import Animations from './internal/lightbox-animations';
import Container from '../mixin/container';
import Modal from '../mixin/modal';
import Slideshow from '../mixin/slideshow';
import Togglable from '../mixin/togglable';
import {$, addClass, ajax, append, assign, attr, css, getImage, html, index, on, pointerDown, pointerMove, removeClass, Transition, trigger} from 'uikit-util';

export default {

    mixins: [Container, Modal, Togglable, Slideshow],

    functional: true,

    props: {
        delayControls: Number,
        preload: Number,
        videoAutoplay: Boolean,
        template: String
    },

    data: () => ({
        preload: 1,
        videoAutoplay: false,
        delayControls: 3000,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        selList: '.uk-lightbox-items',
        attrItem: 'uk-lightbox-item',
        selClose: '.uk-close-large',
        pauseOnHover: false,
        velocity: 2,
        Animations,
        template: `<div class="uk-lightbox uk-overflow-hidden">
                        <ul class="uk-lightbox-items"></ul>
                        <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                            <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close></button>
                         </div>
                        <a class="uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a>
                        <a class="uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade" href="#" uk-slidenav-next uk-lightbox-item="next"></a>
                        <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div>
                    </div>`
    }),

    created() {

        this.$mount(append(this.container, this.template));

        this.caption = $('.uk-lightbox-caption', this.$el);

        this.items.forEach(() => append(this.list, '<li></li>'));

    },

    events: [

        {

            name: `${pointerMove} ${pointerDown} keydown`,

            handler: 'showControls'

        },

        {

            name: 'click',

            self: true,

            delegate() {
                return this.slidesSelector;
            },

            handler(e) {
                e.preventDefault();
                this.hide();
            }

        },

        {

            name: 'shown',

            self: true,

            handler() {
                this.startAutoplay();
                this.showControls();
            }

        },

        {

            name: 'hide',

            self: true,

            handler() {

                this.stopAutoplay();
                this.hideControls();

                removeClass(this.slides, this.clsActive);
                Transition.stop(this.slides);

            }
        },

        {

            name: 'keyup',

            el: document,

            handler(e) {

                if (!this.isToggled(this.$el)) {
                    return;
                }

                switch (e.keyCode) {
                    case 37:
                        this.show('previous');
                        break;
                    case 39:
                        this.show('next');
                        break;
                }
            }
        },

        {

            name: 'beforeitemshow',

            handler(e) {

                if (this.isToggled()) {
                    return;
                }

                this.preventCatch = true;

                e.preventDefault();

                this.toggleNow(this.$el, true);

                this.animation = Animations['scale'];
                removeClass(e.target, this.clsActive);
                this.stack.splice(1, 0, this.index);

            }

        },

        {

            name: 'itemshow',

            handler({target}) {

                const i = index(target);
                const {caption} = this.getItem(i);

                css(this.caption, 'display', caption ? '' : 'none');
                html(this.caption, caption);

                for (let j = 0; j <= this.preload; j++) {
                    this.loadItem(this.getIndex(i + j));
                    this.loadItem(this.getIndex(i - j));
                }

            }

        },

        {

            name: 'itemshown',

            handler() {
                this.preventCatch = false;
            }

        },

        {

            name: 'itemload',

            handler(_, item) {

                const {source, type, alt} = item;

                this.setItem(item, '<span uk-spinner></span>');

                if (!source) {
                    return;
                }

                let matches;

                // Image
                if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)($|\?)/i)) {

                    getImage(source).then(
                        img => this.setItem(item, `<img width="${img.width}" height="${img.height}" src="${source}" alt="${alt ? alt : ''}">`),
                        () => this.setError(item)
                    );

                    // Video
                } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)($|\?)/i)) {

                    const video = $(`<video controls playsinline${item.poster ? ` poster="${item.poster}"` : ''} uk-video="${this.videoAutoplay}"></video>`);
                    attr(video, 'src', source);

                    on(video, 'error', () => this.setError(item));
                    on(video, 'loadedmetadata', () => {
                        attr(video, {width: video.videoWidth, height: video.videoHeight});
                        this.setItem(item, video);
                    });

                    // Iframe
                } else if (type === 'iframe' || source.match(/\.(html|php)($|\?)/i)) {

                    this.setItem(item, `<iframe class="uk-lightbox-iframe" src="${source}" frameborder="0" allowfullscreen></iframe>`);

                    // YouTube
                } else if ((matches = source.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/()youtu\.be\/(.*)/))) {

                    const [, , id] = matches;
                    const setIframe = (width = 640, height = 450) => this.setItem(item, getIframe(`https://www.youtube${matches[1] || ''}.com/embed/${id}`, width, height, this.videoAutoplay));

                    getImage(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`).then(
                        ({width, height}) => {
                            // YouTube default 404 thumb, fall back to low resolution
                            if (width === 120 && height === 90) {
                                getImage(`https://img.youtube.com/vi/${id}/0.jpg`).then(
                                    ({width, height}) => setIframe(width, height),
                                    setIframe
                                );
                            } else {
                                setIframe(width, height);
                            }
                        },
                        setIframe
                    );

                    // Vimeo
                } else if ((matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/))) {

                    ajax(`https://vimeo.com/api/oembed.json?maxwidth=1920&url=${encodeURI(source)}`, {responseType: 'json', withCredentials: false})
                        .then(
                            ({response: {height, width}}) => this.setItem(item, getIframe(`https://player.vimeo.com/video/${matches[2]}`, width, height, this.videoAutoplay)),
                            () => this.setError(item)
                        );

                }

            }

        }

    ],

    methods: {

        loadItem(index = this.index) {

            const item = this.getItem(index);

            if (item.content) {
                return;
            }

            trigger(this.$el, 'itemload', [item]);
        },

        getItem(index = this.index) {
            return this.items[index] || {};
        },

        setItem(item, content) {
            assign(item, {content});
            const el = html(this.slides[this.items.indexOf(item)], content);
            trigger(this.$el, 'itemloaded', [this, el]);
            this.$update(el);
        },

        setError(item) {
            this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
        },

        showControls() {

            clearTimeout(this.controlsTimer);
            this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

            addClass(this.$el, 'uk-active', 'uk-transition-active');

        },

        hideControls() {
            removeClass(this.$el, 'uk-active', 'uk-transition-active');
        }

    }

};

function getIframe(src, width, height, autoplay) {
    return `<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" frameborder="0" allowfullscreen uk-video="autoplay: ${autoplay}" uk-responsive></iframe>`;
}
