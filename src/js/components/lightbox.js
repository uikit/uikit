import Slideshow from '../mixin/slideshow';
import Animations from './internal/lightbox-animations';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Slideshow);

    var {mixin, util} = UIkit;
    var {$, $$, addClass, ajax, append, assign, attr, css, doc, docEl, data, getImage, html, index, on, pointerDown, pointerMove, removeClass, Transition, trigger} = util;

    UIkit.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String,
            autoplay: Boolean,
            autoplayInterval: Number,
            videoAutoplay: Boolean
        },

        defaults: {
            animation: undefined,
            toggle: 'a',
            autoplay: 0,
            videoAutoplay: false
        },

        computed: {

            toggles({toggle}, $el) {
                var toggles = $$(toggle, $el);

                this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.some((el, i) => el !== this._toggles[i]);

                return this._toggles = toggles;
            }

        },

        disconnected() {

            if (this.panel) {
                this.panel.$destroy(true);
                this.panel = null;
            }

        },

        events: [

            {

                name: 'click',

                delegate() {
                    return `${this.toggle}:not(.uk-disabled)`;
                },

                handler(e) {
                    e.preventDefault();
                    e.current.blur();
                    this.show(index(this.toggles, e.current));
                }

            }

        ],

        update() {

            if (this.panel && this.animation) {
                this.panel.$props.animation = this.animation;
                this.panel.$emit();
            }

            if (!this.toggles.length || !this._changed || !this.panel) {
                return;
            }

            this.panel.$destroy(true);
            this._init();

        },

        methods: {

            _init() {
                return this.panel = this.panel || UIkit.lightboxPanel(assign({}, this.$props, {
                    items: this.toggles.reduce((items, el) => {
                        items.push(['href', 'caption', 'type', 'poster'].reduce((obj, attr) => {
                            obj[attr === 'href' ? 'source' : attr] = data(el, attr);
                            return obj;
                        }, {}));
                        return items;
                    }, [])
                }));
            },

            show(index) {

                if (!this.panel) {
                    this._init();
                }

                return this.panel.show(index);

            },

            hide() {

                return this.panel && this.panel.hide();

            }

        }

    });

    UIkit.component('lightbox-panel', {

        mixins: [mixin.container, mixin.togglable, mixin.slideshow],

        functional: true,

        defaults: {
            preload: 1,
            videoAutoplay: false,
            delayControls: 3000,
            items: [],
            cls: 'uk-open',
            clsPage: 'uk-lightbox-page',
            selList: '.uk-lightbox-items',
            attrItem: 'uk-lightbox-item',
            initialAnimation: 'scale',
            pauseOnHover: false,
            velocity: 2,
            Animations: Animations(UIkit),
            template: `<div class="uk-lightbox uk-overflow-hidden">
                            <ul class="uk-lightbox-items"></ul>
                            <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                                <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close uk-toggle="!.uk-lightbox"></button>
                             </div>
                            <a class="uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a>
                            <a class="uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade" href="#" uk-slidenav-next uk-lightbox-item="next"></a>
                            <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div>
                        </div>`
        },

        created() {

            this.$mount(append(this.container, this.template));

            this.caption = $('.uk-lightbox-caption', this.$el);

            this.items.forEach((el, i) => append(this.list, `<li></li>`));

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
                    return `${this.selList} > *`;
                },

                handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'show',

                self: true,

                handler() {
                    addClass(docEl, this.clsPage);
                }
            },

            {

                name: 'shown',

                self: true,

                handler: 'showControls'
            },

            {

                name: 'hide',

                self: true,

                handler: 'hideControls'
            },

            {

                name: 'hidden',

                self: true,

                handler() {
                    removeClass(docEl, this.clsPage);
                }
            },

            {

                name: 'keydown',

                el() {
                    return doc;
                },

                handler(e) {

                    if (!this.isToggled(this.$el)) {
                        return;
                    }

                    switch (e.keyCode) {
                        case 27:
                            this.hide();
                            break;
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

                name: 'toggle',

                handler(e) {
                    e.preventDefault();
                    this.toggle();
                }

            },

            {

                name: 'beforeitemshow',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler() {
                    if (!this.isToggled()) {
                        this.toggleNow(this.$el, true);
                    }
                }

            },

            {

                name: 'itemshow',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({target}) {

                    var i = index(target),
                        caption = this.getItem(i).caption;
                        css(this.caption, 'display', caption ? '' : 'none');
                        html(this.caption, caption);

                    for (var j = 0; j <= this.preload; j++) {
                        this.loadItem(this.getIndex(i + j));
                        this.loadItem(this.getIndex(i - j));
                    }

                }

            },

            {

                name: 'itemload',

                handler(_, item) {

                    var {source, type} = item, matches;

                    this.setItem(item, '<span uk-spinner></span>');

                    if (!source) {
                        return;
                    }

                    // Image
                    if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {

                        getImage(source).then(
                            img => this.setItem(item, `<img width="${img.width}" height="${img.height}" src="${source}">`),
                            () => this.setError(item)
                        );

                    // Video
                    } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)$/i)) {

                        var video = $(`<video controls playsinline${item.poster ? ` poster="${item.poster}"` : ''} uk-video="autoplay: ${this.videoAutoplay}"></video>`);
                        attr(video, 'src', source);

                        on(video, 'error', () => this.setError(item));
                        on(video, 'loadedmetadata', () => {
                            attr(video, {width: video.videoWidth, height: video.videoHeight});
                            this.setItem(item, video);
                        });

                    // Iframe
                    } else if (type === 'iframe') {

                        this.setItem(item, `<iframe class="uk-lightbox-iframe" src="${source}" frameborder="0" allowfullscreen></iframe>`);

                    // Youtube
                    } else if (matches = source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/youtu\.be\/(.*)/)) {

                        var id = matches[1],
                            setIframe = (width = 640, height = 450) => this.setItem(item, getIframe(`//www.youtube.com/embed/${id}`, width, height, this.videoAutoplay));

                        getImage(`//img.youtube.com/vi/${id}/maxresdefault.jpg`).then(
                            ({width, height}) => {
                                //youtube default 404 thumb, fall back to lowres
                                if (width === 120 && height === 90) {
                                    getImage(`//img.youtube.com/vi/${id}/0.jpg`).then(
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
                    } else if (matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {

                        ajax(`//vimeo.com/api/oembed.json?maxwidth=1920&url=${encodeURI(source)}`, {responseType: 'json'})
                            .then(({response: {height, width}}) =>
                                this.setItem(item, getIframe(`//player.vimeo.com/video/${matches[2]}`, width, height, this.videoAutoplay))
                            );

                    }

                }

            }

        ],

        methods: {

            toggle() {
                return this.isToggled() ? this.hide() : this.show();
            },

            hide() {

                if (this.isToggled()) {
                    this.toggleNow(this.$el, false);
                }

                removeClass(this.slides, this.clsActive);
                Transition.stop(this.slides);

                delete this.index;
                delete this.percent;
                delete this._animation;

            },

            loadItem(index = this.index) {

                var item = this.getItem(index);

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
                var el = html(this.slides[this.items.indexOf(item)], content);
                trigger(this.$el, 'itemloaded', [this, el]);
                UIkit.update(null, el);
            },

            setError(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                addClass(this.$el, 'uk-active uk-transition-active');

            },

            hideControls() {
                removeClass(this.$el, 'uk-active uk-transition-active');
            }

        }

    });

    function getIframe(src, width, height, autoplay) {
        return `<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" frameborder="0" allowfullscreen uk-video="autoplay: ${autoplay}" uk-responsive></iframe>`;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
