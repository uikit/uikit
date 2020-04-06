import Animate from '../mixin/animate';
import Class from '../mixin/class';
import {$$, addClass, after, append, assign, attr, before, children, clamp, css, getEventPos, getViewport, hasTouch, height, includes, index, isEmpty, isInput, off, offset, on, parent, pointerDown, pointerMove, pointerUp, remove, removeClass, scrollParents, scrollTop, toggleClass, trigger, within} from 'uikit-util';

export default {

    mixins: [Class, Animate],

    props: {
        group: String,
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

    data: {
        group: false,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false,
        pos: {}
    },

    created() {
        ['init', 'start', 'move', 'end'].forEach(key => {
            const fn = this[key];
            this[key] = e => {
                assign(this.pos, getEventPos(e));
                fn(e);
            };
        });
    },

    events: {

        name: pointerDown,
        passive: false,
        handler: 'init'

    },

    computed: {

        target() {
            return (this.$el.tBodies || [this.$el])[0];
        },

        items() {
            return children(this.target);
        },

        isEmpty: {

            get() {
                return isEmpty(this.items);
            },

            watch(empty) {
                toggleClass(this.target, this.clsEmpty, empty);
            },

            immediate: true

        },

        handles: {

            get({handle}, el) {
                return handle ? $$(handle, el) : this.items;
            },

            watch(handles, prev) {
                css(prev, {touchAction: '', userSelect: ''});
                css(handles, {touchAction: hasTouch ? 'none' : '', userSelect: 'none'}); // touchAction set to 'none' causes a performance drop in Chrome 80
            },

            immediate: true

        }

    },

    update: {

        write() {

            if (!this.drag || !parent(this.placeholder)) {
                return;
            }

            // clamp to viewport
            const {x, y} = this.pos;
            const {offsetTop, offsetLeft} = this.origin;
            const {offsetHeight, offsetWidth} = this.drag;
            const {right, bottom} = offset(window);
            let target = document.elementFromPoint(x, y);

            css(this.drag, {
                top: clamp(y - offsetTop, 0, bottom - offsetHeight),
                left: clamp(x - offsetLeft, 0, right - offsetWidth)
            });

            const sortable = this.getSortable(target);
            const previous = this.getSortable(this.placeholder);
            const move = sortable !== previous;

            if (!sortable || within(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                return;
            }

            target = sortable.target === target.parentNode && target || sortable.items.filter(element => within(target, element))[0];

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

        events: ['move']

    },

    methods: {

        init(e) {

            const {target, button, defaultPrevented} = e;
            const [placeholder] = this.items.filter(el => within(target, el));

            if (!placeholder
                || defaultPrevented
                || button > 0
                || isInput(target)
                || within(target, `.${this.clsNoDrag}`)
                || this.handle && !within(target, this.handle)
            ) {
                return;
            }

            e.preventDefault();

            this.touched = [this];
            this.placeholder = placeholder;
            this.origin = assign({target, index: index(placeholder)}, this.pos);

            on(document, pointerMove, this.move);
            on(document, pointerUp, this.end);

            if (!this.threshold) {
                this.start(e);
            }

        },

        start(e) {

            this.drag = appendDrag(this.$container, this.placeholder);
            const {left, top} = this.placeholder.getBoundingClientRect();
            assign(this.origin, {offsetLeft: this.pos.x - left, offsetTop: this.pos.y - top});

            addClass(this.drag, this.clsDrag, this.clsCustom);
            addClass(this.placeholder, this.clsPlaceholder);
            addClass(this.items, this.clsItem);
            addClass(document.documentElement, this.clsDragState);

            trigger(this.$el, 'start', [this, this.placeholder]);

            trackScroll(this.pos);

            this.move(e);
        },

        move(e) {

            if (this.drag) {
                this.$emit('move');
            } else if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                this.start(e);
            }

        },

        end(e) {

            off(document, pointerMove, this.move);
            off(document, pointerUp, this.end);
            off(window, 'scroll', this.scroll);

            if (!this.drag) {
                if (e.type === 'touchend') {
                    e.target.click();
                }

                return;
            }

            untrackScroll();

            const sortable = this.getSortable(this.placeholder);

            if (this === sortable) {
                if (this.origin.index !== index(this.placeholder)) {
                    trigger(this.$el, 'moved', [this, this.placeholder]);
                }
            } else {
                trigger(sortable.$el, 'added', [sortable, this.placeholder]);
                trigger(this.$el, 'removed', [this, this.placeholder]);
            }

            trigger(this.$el, 'stop', [this, this.placeholder]);

            remove(this.drag);
            this.drag = null;

            const classes = this.touched.map(sortable => `${sortable.clsPlaceholder} ${sortable.clsItem}`).join(' ');
            this.touched.forEach(sortable => removeClass(sortable.items, classes));

            removeClass(document.documentElement, this.clsDragState);

        },

        insert(element, target) {

            addClass(this.items, this.clsItem);

            const insert = () => {

                if (target) {

                    if (!within(element, this.target) || isPredecessor(element, target)) {
                        before(target, element);
                    } else {
                        after(target, element);
                    }

                } else {
                    append(this.target, element);
                }

            };

            if (this.animation) {
                this.animate(insert);
            } else {
                insert();
            }

        },

        remove(element) {

            if (!within(element, this.target)) {
                return;
            }

            if (this.animation) {
                this.animate(() => remove(element));
            } else {
                remove(element);
            }

        },

        getSortable(element) {
            return element && (this.$getComponent(element, 'sortable') || this.getSortable(element.parentNode));
        }

    }

};

function isPredecessor(element, target) {
    return element.parentNode === target.parentNode && index(element) > index(target);
}

let trackTimer;
function trackScroll(pos) {

    let last = Date.now();
    trackTimer = setInterval(() => {

        let {x, y} = pos;
        y += window.pageYOffset;

        const dist = (Date.now() - last) * .3;
        last = Date.now();

        scrollParents(document.elementFromPoint(x, pos.y)).some(scrollEl => {

            let {scrollTop: scroll, scrollHeight} = scrollEl;

            const {top, bottom, height} = offset(getViewport(scrollEl));

            if (top < y && top + 30 > y) {
                scroll -= dist;
            } else if (bottom > y && bottom - 30 < y) {
                scroll += dist;
            } else {
                return;
            }

            if (scroll > 0 && scroll < scrollHeight - height) {
                scrollTop(scrollEl, scroll);
                return true;
            }

        });

    }, 15);

}

function untrackScroll() {
    clearInterval(trackTimer);
}

function appendDrag(container, element) {
    const clone = append(container, element.outerHTML.replace(/(^<)(?:li|tr)|(?:li|tr)(\/>$)/g, '$1div$2'));

    attr(clone, 'style', `${attr(clone, 'style')};margin:0!important`);

    css(clone, assign({
        boxSizing: 'border-box',
        width: element.offsetWidth,
        height: element.offsetHeight,
        overflow: 'hidden'
    }, css(element, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));

    height(clone.firstElementChild, height(element.firstElementChild));

    return clone;
}
