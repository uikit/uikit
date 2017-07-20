import Slideshow from '../mixin/slideshow';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Slideshow);

    var {mixin, util} = UIkit;
    var {$, $trigger, Animation, ajax, assign, doc, docElement, getData, getImage, pointerDown, pointerMove, Transition} = util;

    UIkit.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String
        },

        defaults: {
            animation: undefined,
            toggle: 'a'
        },

        computed: {

            toggles() {
                var toggles = $(this.toggle, this.$el);

                this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.toArray().some((el, i) => el !== this._toggles.get(i));

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
                    this.show(this.toggles.index($(e.currentTarget).blur()));
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
                        animation: this.animation,
                        items: this.toggles.toArray().reduce((items, el) => {
                            items.push(['href', 'caption', 'type'].reduce((obj, attr) => {
                                obj[attr === 'href' ? 'source' : attr] = getData(el, attr);
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

        mixins: [mixin.togglable, mixin.slideshow],

        functional: true,

        defaults: {
            preload: 1,
            delayControls: 3000,
            items: [],
            cls: 'uk-open',
            clsPage: 'uk-lightbox-page',
            clsItem: 'uk-lightbox-item',
            attrItem: 'uk-lightbox-item',
            template: `
                <div class="uk-lightbox uk-overflow-hidden">
                    <ul class="uk-lightbox-items"></ul>
                    <div class="uk-lightbox-toolbar uk-position-top uk-text-right">
                        <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close uk-toggle="!.uk-lightbox"></button>
                     </div>
                    <a class="uk-lightbox-button uk-position-center-left uk-position-medium" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a>
                    <a class="uk-lightbox-button uk-position-center-right uk-position-medium" href="#" uk-slidenav-next uk-lightbox-item="next"></a>
                    <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center"></div>
                </div>`
        },

        computed: {

            container() {
                return $(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            }

        },

        created() {

            this.$mount($(this.template).appendTo(this.container)[0]);

            this.list = this.$el.find('.uk-lightbox-items');
            this.toolbars = this.$el.find('.uk-lightbox-toolbar');
            this.nav = this.$el.find('a[uk-lightbox-item]');
            this.caption = this.$el.find('.uk-lightbox-caption');

            this.items.forEach((el, i) => this.list.append(`<li class="${this.clsItem} item-${i}"></li>`));

        },

        events: [

            {

                name: `${pointerMove} ${pointerDown} keydown`,

                handler: 'showControls'

            },

            {

                name: 'click',

                self: true,

                handler(e) {
                    e.preventDefault();
                    this.hide();
                }

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

                    this.$addClass(docElement, this.clsPage);

                }
            },

            {

                name: 'shown',

                self: true,

                handler() {

                    this.$addClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler() {

                    this.$removeClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);

                }
            },

            {

                name: 'hidden',

                self: true,

                handler() {

                    this.$removeClass(docElement, this.clsPage);

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
                    this.caption.toggle(!!caption).html(caption);

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

                        var video = $('<video controls playsinline uk-video></video>')
                            .on('loadedmetadata', () => this.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight})))
                            .on('error', () => this.setError(item))
                            .attr('src', source);

                    // Iframe
                    } else if (type === 'iframe') {

                        this.setItem(item, `<iframe class="uk-lightbox-iframe" src="${source}" frameborder="0" allowfullscreen></iframe>`);

                    // Youtube
                    } else if (matches = source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/youtu\.be\/(.*)/)) {

                        var id = matches[1],
                            setIframe = (width = 640, height = 450) => this.setItem(item, getIframe(`//www.youtube.com/embed/${id}`, width, height));

                        getImage(`//img.youtube.com/vi/${id}/maxresdefault.jpg`).then(
                            img => {
                                //youtube default 404 thumb, fall back to lowres
                                if (img.width === 120 && img.height === 90) {
                                    getImage(`//img.youtube.com/vi/${id}/0.jpg`).then(
                                        img => setIframe(img.width, img.height),
                                        setIframe
                                    );
                                } else {
                                    setIframe(img.width, img.height);
                                }
                            },
                            setIframe
                        );

                    // Vimeo
                    } else if (matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {

                        ajax({type: 'GET', url: `//vimeo.com/api/oembed.json?url=${encodeURI(source)}`, jsonp: 'callback', dataType: 'jsonp'})
                            .then(({height, width}) => this.setItem(item, getIframe(`//player.vimeo.com/video/${matches[2]}`, width, height)));

                    } else {

                        return;

                    }

                    return true;

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

                this.slides
                    .removeClass(this.clsActive)
                    .each((_, el) => Transition.stop(el));

                delete this.index;
                delete this.percent;
                delete this._animation;

            },

            loadItem(index = this.index) {

                var item = this.getItem(index);

                if (item.content) {
                    return;
                }

                if (!$trigger(this.$el, 'itemload', [item], true).result) {
                    this.setError(item);
                }
            },

            getItem(index = this.index) {
                return this.items[index] || {};
            },

            setItem(item, content) {
                assign(item, {content});
                var el = this.slides.eq(this.items.indexOf(item)).html(content);
                this.$el.trigger('itemloaded', [this, el]);
                UIkit.update(null, el);
            },

            setError(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                if (!this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom');

                this.nav.attr('hidden', this.items.length <= 1);

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade');
                }

            },

            hideControls() {

                if (this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top', 'out');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir = 'in') {
        el.each(i => Animation[dir](el.eq(i).attr('hidden', false), animation).then(() => { dir === 'out' && el.eq(i).attr('hidden', true)}));
    }

    function getIframe(src, width, height) {
        return `<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" uk-video uk-responsive></iframe>`;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
