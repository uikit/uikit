function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin, util} = UIkit;
    var {$, $trigger, Animation, ajax, assign, doc, docElement, fastdom, getData, getImage, getIndex, noop, on, off, pointerDown, pointerMove, pointerUp, preventClick, promise, requestAnimationFrame, Transition} = util;

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
                    this.show(this.toggles.index(e.currentTarget));
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

        mixins: [mixin.togglable],

        functional: true,

        defaults: {
            animation: 'slide',
            transition: 'ease',
            duration: 400,
            attrItem: 'uk-lightbox-item',
            preload: 1,
            items: [],
            index: 0,
            clsPage: 'uk-lightbox-page',
            clsItem: 'uk-lightbox-item',
            stack: [],
            threshold: 15,
            percent: 0,
            cls: 'uk-open',
            clsActive: 'uk-active',
            delayControls: 3000,
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
            },

            slides() {
                return this.list.children(`.${this.clsItem}`);
            },

            forwardDuration() {
                return this.duration / 4;
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

        init() {
            ['start', 'move', 'end'].forEach(key => {
                var fn = this[key];
                this[key] = e => {

                    e = e.originalEvent || e;

                    this.prevPos = this.pos;
                    this.pos = (e.touches && e.touches[0] || e).pageX;

                    fn(e);
                }
            });
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

                name: 'click',

                delegate() {
                    return `[${this.attrItem}]`;
                },

                handler(e) {
                    e.preventDefault();
                    this.show($(e.currentTarget).attr(this.attrItem));
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

                name: pointerDown,

                delegate() {
                    return `.${this.clsItem}`;
                },

                handler: 'start'
            }

        ],

        methods: {

            start(e) {

                if (e.button && e.button !== 0) {
                    return;
                }

                e.preventDefault();

                if (this.stack.length) {
                    this.stack.splice(1);
                    this._animation && this._animation.stop().then(() => this.start(e));
                    return;
                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                this.touch = {
                    start: this.pos,
                    current: this.slides.eq(this.index),
                    prev: this.slides.eq(this.getIndex('previous')),
                    next: this.slides.eq(this.getIndex('next'))
                };

            },

            move() {

                var {start, current, next, prev} = this.touch;

                if (this.pos === this.prevPos || (!this.touching && Math.abs(start - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - start) / current.outerWidth();

                if (this.percent === percent) {
                    return;
                }

                this.percent = percent;

                this.$toggleClass(next, this.clsActive, percent < 0);
                this.$toggleClass(prev, this.clsActive, percent >= 0);

                new Translator(
                    this.animation,
                    this.transition,
                    current,
                    percent >= 0 ? prev : next,
                    percent < 0 ? 1 : -1,
                    noop
                ).translate(Math.abs(percent));

            },

            end(e) {

                e.preventDefault();

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent);

                    if (this.percent < 0.2) {
                        this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;

                    }

                    this.show(percent > 0 ? 'previous': 'next', true);

                    preventClick();

                }

                this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;

            },

            toggle() {
                return this.isToggled() ? this.hide() : this.show();
            },

            show(index, force = false) {

                var hasPrev = this.items.length > 1;
                if (!this.isToggled()) {
                    this.toggleNow(this.$el, true);
                    hasPrev = false;
                }

                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this.stack.length === 2) {
                        this._animation.forward(this.forwardDuration);
                    }

                    return;
                }

                var dir = index === 'next' ? 1 : -1;

                index = this.getIndex(index);

                var prev = hasPrev && this.slides.eq(this.index),
                    next = this.slides.eq(index);

                this.index = index;

                this.$addClass(next, this.clsActive);

                var caption = this.getItem(index).caption;
                this.caption.toggle(!!caption).text(caption);

                this._animation = new Translator(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, () => {

                    prev && this.$removeClass(prev, this.clsActive);

                    this.stack.shift();
                    if (this.stack.length) {
                        requestAnimationFrame(() => this.show(this.stack.shift(), true));
                    } else {
                        this._animation = null;
                    }

                    this.$el.trigger('itemshown', [this, next]);

                    if (prev) {
                        this.$el.trigger('itemhidden', [this, prev]);
                        UIkit.update(null, prev);
                    }

                });

                this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                for (var i = 0; i <= this.preload; i++) {
                    this.loadItem(this.getIndex(index + i));
                    this.loadItem(this.getIndex(index - i));
                }

                this.$el.trigger('itemshow', [this, next]);
                prev && this.$el.trigger('itemhide', [this, prev]);
                UIkit.update(null, next);
                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
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

                this.setItem(item, '<span uk-spinner></span>');

                if (!$trigger(this.$el, 'itemload', [item], true).isImmediatePropagationStopped()) {
                    this.setError(item);
                }
            },

            getItem(index = this.index) {
                return this.items[index] || {source: '', caption: '', type: ''};
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

            getIndex(index = this.index) {
                return getIndex(index, this.items, this.index);
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
                    animate(this.nav.eq(0), 'uk-animation-fade');
                    animate(this.nav.eq(1), 'uk-animation-fade');
                }

            },

            hideControls() {

                if (this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top', 'out');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav.eq(0), 'uk-animation-fade', 'out');
                    animate(this.nav.eq(1), 'uk-animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir = 'in') {
        Animation[dir](el.attr('hidden', false), animation).then(() => { dir === 'out' && el.attr('hidden', true)})
    }

    function Translator (animation, transition, current, next, dir, cb) {

        animation = animation in Animations ? Animations[animation] : Animations.slide;

        return {

            show(duration, percent = 0) {

                duration -= Math.round(duration * percent);

                var props = animation.show(dir);

                this.translate(percent);

                return promise.all([
                    Transition.start(current, props[0], duration, transition),
                    Transition.start(next, props[1], duration, transition)
                ]).then(() => {
                    for (var prop in props[0]) {
                        $([next[0], current[0]]).css(prop, '');
                    }
                    cb();
                }, noop);
            },

            stop() {
                return promise.all([
                    Transition.stop(next),
                    Transition.stop(current)
                ])
            },

            forward(duration) {

                var percent = animation.percent(current);

                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]).then(() => this.show(duration, percent));

            },

            translate(percent) {

                var props = animation.translate(percent, dir);
                current.css(props[0]);
                next.css(props[1]);

            }

        }

    }

    var diff = 0.2;
    var Animations = {

        fade: {

            show() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent(current) {
                return 1 - current.css('opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        slide: {

            show(dir) {
                return [
                    {transform: `translate3d(${-1 * dir * 100}%, 0, 0)`},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent(current) {
                return Math.abs(current.css('transform').split(',')[4] / current.outerWidth());
            },

            translate(percent, dir) {
                return [
                    {transform: `translate3d(${dir * -100 * percent}%, 0, 0)`},
                    {transform: `translate3d(${dir * 100 * (1 - percent)}%, 0, 0)`}
                ];
            }

        },

        scale: {

            show() {
                return [
                    {opacity: 0, transform: `scale3d(${1 - diff}, ${1 - diff}, 1)`},
                    {opacity: 1, transform: 'scale3d(1, 1, 1)'}
                ];
            },

            percent(current) {
                return 1 - current.css('opacity');
            },

            translate(percent) {
                var scale1 = 1 - diff * percent,
                    scale2 = 1 - diff + diff * percent;

                return [
                    {opacity: 1 - percent, transform: `scale3d(${scale1}, ${scale1}, 1)`},
                    {opacity: percent, transform: `scale3d(${scale2}, ${scale2}, 1)`}
                ];
            }

        }

    };


    UIkit.mixin({

        events: {

            itemload(e, item) {

                if (!(item.type === 'image' || item.source && item.source.match(/\.(jp(e)?g|png|gif|svg)$/i))) {
                    return;
                }

                getImage(item.source).then(
                    img => this.setItem(item, `<img width="${img.width}" height="${img.height}" src ="${item.source}">`),
                    () => this.setError(item)
                );

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            itemload(e, item) {

                if (!(item.type === 'video' || item.source && item.source.match(/\.(mp4|webm|ogv)$/i))) {
                    return;
                }

                var video = $('<video controls playsinline uk-video></video>')
                    .on('loadedmetadata', () => this.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight})))
                    .on('error', () => this.setError(item))
                    .attr('src', item.source);

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            itemload(e, item) {

                var matches = item.source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || item.source.match(/youtu\.be\/(.*)/);

                if (!matches) {
                    return;
                }

                var id = matches[1],
                    setIframe = (width = 640, height = 320) => this.setItem(item, getIframe(`//www.youtube.com/embed/${id}`, width, height));

                getImage(`//img.youtube.com/vi/${id}/maxresdefault.jpg`).then(
                    img => {
                        //youtube default 404 thumb, fall back to lowres
                        if (img.width === 120 && img.height === 90) {
                            getImage(`//img.youtube.com/vi/${id}/0.jpg`).then(
                                () => setIframe(img.width, img.height),
                                setIframe
                            );
                        } else {
                            setIframe(img.width, img.height);
                        }
                    },
                    setIframe
                );

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            itemload(e, item) {

                var matches = item.source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/);

                if (!matches) {
                    return;
                }

                ajax({type: 'GET', url: `http://vimeo.com/api/oembed.json?url=${encodeURI(item.source)}`, jsonp: 'callback', dataType: 'jsonp'})
                    .then(({height, width}) => this.setItem(item, getIframe(`//player.vimeo.com/video/${matches[2]}`, width, height)));

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    function getIframe(src, width, height) {
        return `<iframe src="${src}" width="${width}" height="${height}" style="max-width: 100%; box-sizing: border-box;" uk-video uk-responsive></iframe>`;
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
