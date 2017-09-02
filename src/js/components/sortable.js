function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {mixin, util} = UIkit;
    var {$, addClass, assign, attr, doc, docEl, height, fastdom, includes, noop, offset, off, on, pointerDown, pointerMove, pointerUp, position, preventClick, promise, removeClass, toggleClass, Transition, trigger, win, within} = util;

    UIkit.component('sortable', {

        mixins: [mixin.class],

        props: {
            group: String,
            animation: Number,
            threshold: Number,
            clsItem: String,
            clsPlaceholder: String,
            clsDrag: String,
            clsDragState: String,
            clsBase: String,
            clsNoDrag: String,
            clsEmpty: String,
            clsCustom: String,
            handle: String
        },

        defaults: {
            group: false,
            animation: 150,
            threshold: 5,
            clsItem: 'uk-sortable-item',
            clsPlaceholder: 'uk-sortable-placeholder',
            clsDrag: 'uk-sortable-drag',
            clsDragState: 'uk-drag',
            clsBase: 'uk-sortable',
            clsNoDrag: 'uk-sortable-nodrag',
            clsEmpty: 'uk-sortable-empty',
            clsCustom: '',
            handle: false
        },

        init() {
            ['init', 'start', 'move', 'end'].forEach(key => {
                var fn = this[key];
                this[key] = e => {
                    this.scrollY = win.scrollY;
                    var {pageX: x, pageY: y} = e.touches && e.touches[0] || e;
                    this.pos = {x, y};

                    fn(e);
                }
            });
        },

        events: {

            [pointerDown]: 'init'

        },

        update: {

            write() {

                if (this.clsEmpty) {
                    toggleClass(this.$el, this.clsEmpty, !this.$el.children().length);
                }

                if (!this.drag) {
                    return;
                }

                offset(this.drag, {top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

                var top = offset(this.drag).top, bottom = top + this.drag[0].offsetHeight;

                if (top > 0 && top < this.scrollY) {
                    setTimeout(() => win.scrollTop(this.scrollY - 5), 5);
                } else if (bottom < height(doc) && bottom > height(win) + this.scrollY) {
                    setTimeout(() => win.scrollTop(this.scrollY + 5), 5);
                }

            }

        },

        methods: {

            init(e) {

                var target = $(e.target), placeholder = this.$el.children().filter((i, el) => within(e.target, el));

                if (!placeholder.length
                    || target.is(':input')
                    || this.handle && !within(target, this.handle)
                    || e.button && e.button !== 0
                    || within(target, `.${this.clsNoDrag}`)
                    || e.defaultPrevented
                ) {
                    return;
                }

                e.preventDefault();

                this.touched = [this];
                this.placeholder = placeholder;
                this.origin = assign({target, index: this.placeholder.index()}, this.pos);

                on(docEl, pointerMove, this.move);
                on(docEl, pointerUp, this.end);
                on(win, 'scroll', this.scroll);

                if (!this.threshold) {
                    this.start(e);
                }

            },

            start(e) {

                this.drag = $(this.placeholder[0].outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'))
                    .css({
                        boxSizing: 'border-box',
                        width: this.placeholder[0].offsetWidth,
                        height: this.placeholder[0].offsetHeight
                    })
                    .css(this.placeholder.css(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']));

                attr(this.drag, 'uk-no-boot', '');
                this.drag.appendTo(UIkit.container);
                addClass(this.drag, `${this.clsDrag} ${this.clsCustom}`);

                height(this.drag.children().first(), height(this.placeholder.children().first()));

                var {left, top} = offset(this.placeholder);
                assign(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

                addClass(this.placeholder, this.clsPlaceholder);
                addClass(this.$el.children(), this.clsItem);
                addClass(docEl, this.clsDragState);

                trigger(this.$el, 'start', [this, this.placeholder, this.drag]);

                this.move(e);
            },

            move(e) {

                if (!this.drag) {

                    if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                        this.start(e);
                    }

                    return;
                }

                this.$emit();

                var target = e.type === 'mousemove' ? e.target : doc.elementFromPoint(this.pos.x - doc.body.scrollLeft, this.pos.y - doc.body.scrollTop),
                    sortable = getSortable(target),
                    previous = getSortable(this.placeholder[0]),
                    move = sortable !== previous;

                if (!sortable || within(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                    return;
                }

                target = sortable.$el.is(target.parentNode) && $(target) || sortable.$el.children().has(target);

                if (move) {
                    previous.remove(this.placeholder);
                } else if (!target.length) {
                    return;
                }

                sortable.insert(this.placeholder, target);

                if (!includes(this.touched, sortable)) {
                    this.touched.push(sortable);
                }

            },

            scroll() {
                var scroll = win.scrollY;
                if (scroll !== this.scrollY) {
                    this.pos.y += scroll - this.scrollY;
                    this.scrollY = scroll;
                    this.$emit();
                }
            },

            end(e) {

                off(docEl, pointerMove, this.move);
                off(docEl, pointerUp, this.end);
                off(win, 'scroll', this.scroll);

                if (!this.drag) {

                    if (e.type !== 'mouseup' && within(e.target, 'a[href]')) {
                        location.href = $(e.target).closest('a[href]')[0].href;
                    }

                    return;
                }

                preventClick();

                var sortable = getSortable(this.placeholder[0]);

                if (this === sortable) {
                    if (this.origin.index !== this.placeholder.index()) {
                        trigger(this.$el, 'change', [this, this.placeholder, 'moved']);
                    }
                } else {
                    trigger(sortable.$el, 'change', [sortable, this.placeholder, 'added']);
                    trigger(this.$el, 'change', [this, this.placeholder, 'removed']);
                }

                trigger(this.$el, 'stop', [this]);

                this.drag.remove();
                this.drag = null;

                var classes = this.touched.map(sortable => `${sortable.clsPlaceholder} ${sortable.clsItem}`).join(' ');
                this.touched.forEach(sortable => removeClass(sortable.$el.children(), classes));

                removeClass(docEl, this.clsDragState);

            },

            insert(element, target) {

                addClass(this.$el.children(), this.clsItem);

                var insert = () => {

                    if (target.length) {

                        if (!this.$el.has(element).length || element.prevAll().filter(target).length) {
                            element.insertBefore(target);
                        } else {
                            element.insertAfter(target);
                        }

                    } else {
                        this.$el.append(element);
                    }

                };

                if (this.animation) {
                    this.animate(insert);
                } else {
                    insert();
                }

            },

            remove(element) {

                if (!this.$el.has(element).length) {
                    return;
                }

                if (this.animation) {
                    this.animate(() => element.detach());
                } else {
                    element.detach();
                }

            },

            animate(action) {

                var props = [],
                    children = this.$el.children().toArray().map(el => {
                        el = $(el);
                        props.push(assign({
                            position: 'absolute',
                            pointerEvents: 'none',
                            width: el[0].offsetWidth,
                            height: el[0].offsetHeight
                        }, position(el)));
                        return el;
                    }),
                    reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: ''};

                action();

                children.forEach(Transition.cancel);
                this.$el.children().css(reset);
                this.$update('update', true);
                fastdom.flush();

                this.$el.css('minHeight', height(this.$el));

                var positions = children.map(el => position(el));
                promise.all(children.map((el, i) => Transition.start(el.css(props[i]), positions[i], this.animation)))
                    .then(() => {
                        this.$el.css('minHeight', '').children().css(reset);
                        this.$update('update', true);
                        fastdom.flush();
                    }, noop);

            }

        }

    });

    function getSortable(element) {
        return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
