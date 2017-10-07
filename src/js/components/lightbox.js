import Slideshow from '../mixin/slideshow';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Slideshow);

    var {mixin, util} = UIkit;
    var {$, $$, addClass, Animation, ajax, append, assign, attr, css, doc, docEl, data, getImage, hasAttr, html, index, on, pointerDown, pointerMove, removeClass, Transition, trigger} = util;

    UIkit.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String,
            autoplay: Number,
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
                return this.panel = this.panel || UIkit.lightboxPanel({
                    autoplay: this.autoplay,
                    videoAutoplay: this.videoAutoplay,
                    animation: this.animation,
                    items: this.toggles.reduce((items, el) => {
                        items.push(['href', 'caption', 'type', 'poster'].reduce((obj, attr) => {
                            obj[attr === 'href' ? 'source' : attr] = data(el, attr);
                            return obj;
                        }, {}));
                        return items;
                    }, [])
                });
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
            clsItem: 'uk-lightbox-item',
            attrItem: 'uk-lightbox-item',
            template: `<div class="uk-lightbox uk-overflow-hidden">
                            <ul class="uk-lightbox-items"></ul>
                            <div class="uk-lightbox-toolbar uk-position-top uk-text-right">
                                <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close uk-toggle="!.uk-lightbox"></button>
                             </div>
                            <a class="uk-lightbox-button uk-position-center-left uk-position-medium" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a>
                            <a class="uk-lightbox-button uk-position-center-right uk-position-medium" href="#" uk-slidenav-next uk-lightbox-item="next"></a>
                            <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center"></div>
                        </div>`
        },

        created() {

            this.$mount(append(this.container, this.template));

            this.list = $('.uk-lightbox-items', this.$el);
            this.toolbars = $$('.uk-lightbox-toolbar', this.$el);
            this.nav = $$('a[uk-lightbox-item]', this.$el);
            this.caption = $('.uk-lightbox-caption', this.$el);

            this.items.forEach((el, i) => append(this.list, `<li class="${this.clsItem} item-${i}"></li>`));

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
                    return `.${this.clsItem}`;
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

                handler() {

                    addClass(this.caption, 'uk-animation-slide-bottom');
                    attr(this.toolbars, 'hidden', '');
                    attr(this.nav, 'hidden', '');
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler() {

                    removeClass(this.caption, 'uk-animation-slide-bottom');
                    attr(this.toolbars, 'hidden', '');
                    attr(this.nav, 'hidden', '');

                }
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

                handler() {
                    if (!this.isToggled()) {
                        this.toggleNow(this.$el, true);
                    }
                }

            },

            {

                name: 'itemshow',

                self: true,

                handler() {

                    var caption = this.getItem().caption;
                    css(this.caption, 'display', caption ? '' : 'none');
                    html(this.caption, caption);

                    for (var i = 0; i <= this.preload; i++) {
                        this.loadItem(this.getIndex(this.index + i));
                        this.loadItem(this.getIndex(this.index - i));
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

                if (!hasAttr(this.toolbars, 'hidden')) {
                    return;
                }

                animate(this.toolbars[0], 'uk-animation-slide-top');
                animate(this.toolbars[1], 'uk-animation-slide-bottom');

                attr(this.nav, 'hidden', this.items.length <= 1 ? '' : null);

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade');
                }

            },

            hideControls() {

                if (hasAttr(this.toolbars, 'hidden')) {
                    return;
                }

                animate(this.toolbars[0], 'uk-animation-slide-top', 'out');
                animate(this.toolbars[1], 'uk-animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir = 'in') {
        attr(el, 'hidden', null);
        Animation[dir](el, animation).then(() => dir === 'out' && attr(el, 'hidden', ''));
    }

    function getIframe(src, width, height, autoplay) {
        return `<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" frameborder="0" allowfullscreen uk-video="autoplay: ${autoplay}" uk-responsive></iframe>`;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
