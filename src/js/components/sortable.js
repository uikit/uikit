function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {mixin, util} = UIkit;
    const {addClass, after, assign, append, attr, before, closest, css, doc, docEl, height, fastdom, getPos, includes, index, isInput, noop, offset, off, on, pointerDown, pointerMove, pointerUp, position, preventClick, Promise, remove, removeClass, toggleClass, toNodes, Transition, trigger, win, within} = util;

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
                const fn = this[key];
                this[key] = e => {
                    this.scrollY = win.pageYOffset;
                    const {x, y} = getPos(e);
                    this.pos = {x, y};

                    fn(e);
                };
            });
        },

        events: {

            [pointerDown]: 'init'

        },

        update: {

            write() {

                if (this.clsEmpty) {
                    toggleClass(this.$el, this.clsEmpty, !this.$el.children.length);
                }

                if (!this.drag) {
                    return;
                }

                offset(this.drag, {top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

                const {top} = offset(this.drag);
                const bottom = top + this.drag.offsetHeight;
                let scroll;

                if (top > 0 && top < this.scrollY) {
                    scroll = this.scrollY - 5;
                } else if (bottom < height(doc) && bottom > height(win) + this.scrollY) {
                    scroll = this.scrollY + 5;
                }

                scroll && setTimeout(() => win.scrollTo(win.scrollX, scroll), 5);
            }

        },

        methods: {

            init(e) {

                const {target, button, defaultPrevented} = e;
                const [placeholder] = toNodes(this.$el.children).filter(el => within(target, el));

                if (!placeholder
                    || isInput(e.target)
                    || this.handle && !within(target, this.handle)
                    || button > 0
                    || within(target, `.${this.clsNoDrag}`)
                    || defaultPrevented
                ) {
                    return;
                }

                e.preventDefault();

                this.touched = [this];
                this.placeholder = placeholder;
                this.origin = assign({target, index: index(placeholder)}, this.pos);

                on(docEl, pointerMove, this.move);
                on(docEl, pointerUp, this.end);
                on(win, 'scroll', this.scroll);

                if (!this.threshold) {
                    this.start(e);
                }

            },

            start(e) {

                this.drag = append(UIkit.container, this.placeholder.outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'));

                css(this.drag, assign({
                    boxSizing: 'border-box',
                    width: this.placeholder.offsetWidth,
                    height: this.placeholder.offsetHeight
                }, css(this.placeholder, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));
                attr(this.drag, 'uk-no-boot', '');
                addClass(this.drag, this.clsDrag, this.clsCustom);

                height(this.drag.firstElementChild, height(this.placeholder.firstElementChild));

                const {left, top} = offset(this.placeholder);
                assign(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

                addClass(this.placeholder, this.clsPlaceholder);
                addClass(this.$el.children, this.clsItem);
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

                let target = e.type === 'mousemove' ? e.target : doc.elementFromPoint(this.pos.x - doc.body.scrollLeft, this.pos.y - doc.body.scrollTop);

                const sortable = getSortable(target);
                const previous = getSortable(this.placeholder);
                const move = sortable !== previous;

                if (!sortable || within(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                    return;
                }

                target = sortable.$el === target.parentNode && target || toNodes(sortable.$el.children).filter(element => within(target, element))[0];

                if (move) {
                    previous.remove(this.placeholder);
                } else if (!target) {
                    return;
                }

                sortable.insert(this.placeholder, target);

                if (!includes(this.touched, sortable)) {
                    this.touched.push(sortable);
                }

            },

            scroll() {
                const scroll = win.pageYOffset;
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
                        location.href = closest(e.target, 'a[href]').href;
                    }

                    return;
                }

                preventClick();

                const sortable = getSortable(this.placeholder);

                if (this === sortable) {
                    if (this.origin.index !== index(this.placeholder)) {
                        trigger(this.$el, 'moved', [this, this.placeholder]);
                    }
                } else {
                    trigger(sortable.$el, 'added', [sortable, this.placeholder]);
                    trigger(this.$el, 'removed', [this, this.placeholder]);
                }

                trigger(this.$el, 'stop', [this]);

                remove(this.drag);
                this.drag = null;

                const classes = this.touched.map(sortable => `${sortable.clsPlaceholder} ${sortable.clsItem}`).join(' ');
                this.touched.forEach(sortable => removeClass(sortable.$el.children, classes));

                removeClass(docEl, this.clsDragState);

            },

            insert(element, target) {

                addClass(this.$el.children, this.clsItem);

                const insert = () => {

                    if (target) {

                        if (!within(element, this.$el) || isPredecessor(element, target)) {
                            before(target, element);
                        } else {
                            after(target, element);
                        }

                    } else {
                        append(this.$el, element);
                    }

                };

                if (this.animation) {
                    this.animate(insert);
                } else {
                    insert();
                }

            },

            remove(element) {

                if (!within(element, this.$el)) {
                    return;
                }

                if (this.animation) {
                    this.animate(() => remove(element));
                } else {
                    remove(element);
                }

            },

            animate(action) {

                const props = [];
                const children = toNodes(this.$el.children);
                const reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: '', bottom: '', right: ''};

                children.forEach(el => {
                    props.push(assign({
                        position: 'absolute',
                        pointerEvents: 'none',
                        width: el.offsetWidth,
                        height: el.offsetHeight
                    }, position(el)));
                });

                action();

                children.forEach(Transition.cancel);
                css(this.$el.children, reset);
                this.$update('update', true);
                fastdom.flush();

                css(this.$el, 'minHeight', height(this.$el));

                const positions = children.map(el => position(el));
                Promise.all(children.map((el, i) => Transition.start(css(el, props[i]), positions[i], this.animation)))
                    .then(() => {
                        css(this.$el, 'minHeight', '');
                        css(children, reset);
                        this.$update('update', true);
                        fastdom.flush();
                    }, noop);

            }

        }

    });

    function getSortable(element) {
        return element && (UIkit.getComponent(element, 'sortable') || getSortable(element.parentNode));
    }

    function isPredecessor(element, target) {
        return element.parentNode === target.parentNode && index(element) > index(target);
    }

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
