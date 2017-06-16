function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin, util} = UIkit;
    var {$, $trigger, Animation, ajax, assign, doc, docElement, getImage, getIndex, noop, on, off, pointerDown, pointerMove, pointerUp, preventClick, promise, requestAnimationFrame, Transition} = util;

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
                            items.push({
                                source: el.getAttribute('href'),
                                title: el.getAttribute('title'),
                                type: el.getAttribute('type')
                            });
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
            cls: 'uk-open',
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
            controlsDelay: 5000,
            template: `
                <div class="uk-lightbox uk-overflow-hidden">                    
                    <ul></ul>
                    <div class="uk-lightbox-toolbar uk-position-top uk-text-right">
                        <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close uk-toggle="!.uk-lightbox"></button>
                     </div>
                    <a class="uk-lightbox-button uk-position-center-left uk-position-medium" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a>
                    <a class="uk-lightbox-button uk-position-center-right uk-position-medium" href="#" uk-slidenav-next uk-lightbox-item="next"></a>
                    <div class="uk-lightbox-toolbar uk-position-bottom uk-text-center"></div>
                </div>`
        },

        computed: {

            container() {
                return $(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            },

            slides() {
                return this.list.children(`.${this.clsItem}`);
            }

        },

        created() {

            this.$mount($(this.template).appendTo(this.container)[0]);

            this.list = this.$el.find('ul:first');
            this.toolbar = this.$el.find('.uk-lightbox-toolbar:first');
            this.nav = this.$el.find('a[uk-lightbox-item]');
            this.caption = this.$el.find('.uk-lightbox-toolbar').eq(1);

            this.items.forEach((el, i) => this.list.append(`<li class="${this.clsItem} item-${i}"></li>`));

        },

        init() {
            ['start', 'move', 'end'].forEach(key => {
                let fn = this[key];
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
                    this.toolbar.attr('hidden', true);
                    this.nav.attr('hidden', true);
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler() {

                    this.$removeClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbar.attr('hidden', true);
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

                if (this.stack.length || e.button && e.button !== 0) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

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

                next.css('visibility', percent >= 0 ? 'visible' : '');
                prev.css('visibility', percent < 0 ? 'visible' : '');

                new Translator(
                    this.animation,
                    this.transition,
                    current,
                    percent >= 0 ? next : prev,
                    percent < 0 ? -1 : 1,
                    noop
                ).translate(Math.abs(percent));

            },

            end() {

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent);

                    if (this.percent < 0.3) {
                        this.index = this.getIndex(percent < 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;

                    }

                    this.show(percent < 0 ? 'previous': 'next', true);

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

                var hasPrev = true;
                if (!this.isToggled()) {
                    this.toggleNow(this.$el, true);
                    hasPrev = false;
                }

                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this._animation && this.stack.length === 2) {
                        this._animation.forward(100);
                    }

                    return;
                }

                var dir = index === 'previous' ? -1 : 1;

                index = this.getIndex(index);

                let prev = hasPrev && this.slides.eq(this.index),
                    next = this.slides.eq(index);

                this.index = index;

                next.css('visibility', 'visible');
                this.caption.text(this.getItem(index).title);

                this._animation = new Translator(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, () => {

                    prev && prev.css('visibility', '');

                    this.stack.shift();
                    if (this.stack.length) {
                        requestAnimationFrame(() => this.show(this.stack.shift(), true));
                    } else {
                        this._animation = null;
                    }

                });

                this._animation.show(this.stack.length > 1 ? 100 : 400, this.percent);

                for (var i = 0; i <= this.preload; i++) {
                    this.loadItem(this.getIndex(index + i));
                    this.loadItem(this.getIndex(index - i));
                }

            },

            hide() {

                if (this.isToggled()) {
                    this.toggleNow(this.$el, false);
                }

                this.slides
                    .css('visibility', '')
                    .each((_, el) => Transition.stop(el));

                delete this.index;
                delete this._animation;

            },

            loadItem(index = this.index) {

                var item = this.getItem(index);

                if (item.content) {
                    return;
                }

                this.setItem(item, '<span uk-spinner></span>');

                if (!$trigger(this.$el, 'loaditem', [item], true).isImmediatePropagationStopped()) {
                    this.setError(item);
                }
            },

            getItem(index = this.index) {
                return this.items[index] || {source: '', title: '', type: ''};
            },

            setItem(item, content, width = 100, height = 100) {
                assign(item, {content, width, height});
                this.slides.eq(this.items.indexOf(item)).html(content);
            },

            setError(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            getIndex(index = this.index) {
                return getIndex(index, this.items, this.index);
            },

            showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.controlsDelay);

                if (!this.toolbar.attr('hidden')) {
                    return;
                }

                Animation.in(this.toolbar.attr('hidden', false), 'uk-animation-slide-top');

                this.nav.attr('hidden', this.items.length <= 1);

                if (this.items.length > 1) {
                    Animation.in(this.nav.eq(0), 'uk-animation-fade');
                    Animation.in(this.nav.eq(1), 'uk-animation-fade');
                }

            },

            hideControls() {

                if (this.toolbar.attr('hidden')) {
                    return;
                }

                Animation.out(this.toolbar, 'uk-animation-slide-top').then(() => this.toolbar.attr('hidden', true));

                if (this.items.length > 1) {
                    Animation.out(this.nav.eq(0), 'uk-animation-fade').then(() => this.nav.eq(0).attr('hidden', true));
                    Animation.out(this.nav.eq(1), 'uk-animation-fade').then(() => this.nav.eq(1).attr('hidden', true));
                }

            }

        }

    });

    function Translator (animation, transition, current, next, dir, cb) {

        animation = animation in this ? this[animation] : this.slide;

        return {

            show(duration = 400, percent = 0) {

                duration -= Math.round(duration * percent);

                let props = animation.show(dir);

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

            forward(duration = 100) {

                let percent = animation.percent(current);

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
    Translator.prototype = {

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
                    {transform: `translate3d(${dir * 100}%, 0, 0)`},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent(current) {
                return Math.abs(current.css('transform').split(',')[4] / current.outerWidth());
            },

            translate(percent, dir) {
                return [
                    {transform: `translate3d(${dir * 100 * percent}%, 0, 0)`},
                    {transform: `translate3d(${dir * -100 * (1 - percent)}%, 0, 0)`}
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

        },

    };

    UIkit.mixin({

        events: {

            loaditem(e, item) {

                if (!(item.type === 'image' || item.source && item.source.match(/\.(jp(e)?g|png|gif|svg)$/i))) {
                    return;
                }

                getImage(item.source).then(
                    img => this.setItem(item, `<img class="uk-responsive-width" width="${img.width}" height="${img.height}" src ="${item.source}">`, img.width, img.height),
                    () => this.setError(item)
                );

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            loaditem(e, item) {

                if (!(item.type === 'video' || item.source && item.source.match(/\.(mp4|webm|ogv)$/i))) {
                    return;
                }

                var video = $('<video class="uk-responsive-width" controls></video>')
                    .on('loadedmetadata', () => this.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight}), video[0].videoWidth, video[0].videoHeight))
                    .attr('src', item.source);

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            loaditem(e, item) {

                let matches = item.source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || item.source.match(/youtu\.be\/(.*)/);

                if (!matches) {
                    return;
                }

                let id = matches[1],
                    img = new Image(),
                    lowres = false,
                    setIframe = (width, height) => this.setItem(item, `<iframe src="//www.youtube.com/embed/${id}" width="${width}" height="${height}" style="max-width:100%;box-sizing:border-box;"></iframe>`, width, height);

                img.onerror = () => setIframe(640, 320);
                img.onload = () => {
                    //youtube default 404 thumb, fall back to lowres
                    if (img.width === 120 && img.height === 90) {
                        if (!lowres) {
                            lowres = true;
                            img.src = `//img.youtube.com/vi/${id}/0.jpg`;
                        } else {
                            setIframe(640, 320);
                        }
                    } else {
                        setIframe(img.width, img.height);
                    }
                };

                img.src = `//img.youtube.com/vi/${id}/maxresdefault.jpg`;

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    UIkit.mixin({

        events: {

            loaditem(e, item) {

                let matches = item.source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/);

                if (!matches) {
                    return;
                }

                let id = matches[2],
                    setIframe = (width, height) => this.setItem(item, `<iframe src="//player.vimeo.com/video/${id}" width="${width}" height="${height}" style="max-width:100%;box-sizing:border-box;"></iframe>`, width, height);

                ajax({type: 'GET', url: `http://vimeo.com/api/oembed.json?url=${encodeURI(item.source)}`, jsonp: 'callback', dataType: 'jsonp'}).then((res) => setIframe(res.width, res.height));

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
