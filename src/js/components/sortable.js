import Animate from '../mixin/animate';
import Class from '../mixin/class';
import {$$, addClass, append, assign, before, children, css, getEventPos, getViewport, hasTouch, height, index, isEmpty, isInput, off, offset, on, parent, pointerDown, pointerMove, pointerUp, pointInRect, remove, removeClass, scrollParents, scrollTop, toggleClass, Transition, trigger, within} from 'uikit-util';

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
        group: '',
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

            const {pos: {x, y}, origin: {offsetTop, offsetLeft}, placeholder} = this;

            css(this.drag, {
                top: y - offsetTop,
                left: x - offsetLeft
            });

            const previous = this.getSortable(placeholder);
            const sortable = this.getSortable(document.elementFromPoint(x, y));

            if (!sortable) {
                return;
            }

            this.touched.add(sortable);

            if (sortable !== previous) {
                previous.remove(placeholder);
                sortable.insert(placeholder);
            }

            const {items} = sortable;

            if (items.length < 2 || items.concat(this.target).some(Transition.inProgress)) {
                return;
            }

            const targetIndex = findTarget(items, x, y, index(placeholder));

            if (~targetIndex && items[targetIndex - 1] !== placeholder && items[targetIndex] !== placeholder) {
                sortable.insert(placeholder, items[targetIndex]);
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

            this.touched = new Set([this]);
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

        end() {

            off(document, pointerMove, this.move);
            off(document, pointerUp, this.end);
            off(window, 'scroll', this.scroll);

            if (!this.drag) {
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

            this.touched.forEach(({clsPlaceholder, clsItem}) =>
                this.touched.forEach(sortable =>
                    removeClass(sortable.items, clsPlaceholder, clsItem)
                )
            );
            this.touched = null;
            removeClass(document.documentElement, this.clsDragState);

        },

        insert(element, target) {

            addClass(this.items, this.clsItem);

            const insert = () => target
                ? before(target, element)
                : append(this.target, element);

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
            do {
                const sortable = this.$getComponent(element, 'sortable');

                if (sortable && sortable.group === this.group) {
                    return sortable;
                }
            } while ((element = parent(element)));
        }

    }

};

let trackTimer;
function trackScroll(pos) {

    let last = Date.now();
    trackTimer = setInterval(() => {

        let {x, y} = pos;
        y += window.pageYOffset;

        const dist = (Date.now() - last) * .3;
        last = Date.now();

        scrollParents(document.elementFromPoint(x, pos.y)).reverse().some(scrollEl => {

            let {scrollTop: scroll, scrollHeight} = scrollEl;

            const {top, bottom, height} = offset(getViewport(scrollEl));

            if (top < y && top + 35 > y) {
                scroll -= dist;
            } else if (bottom > y && bottom - 35 < y) {
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

    clone.style.setProperty('margin', '0', 'important');

    css(clone, assign({
        boxSizing: 'border-box',
        width: element.offsetWidth,
        height: element.offsetHeight
    }, css(element, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));

    height(clone.firstElementChild, height(element.firstElementChild));

    return clone;
}

function findTarget(items, x, y, current) {

    const rects = items.map(child => child.getBoundingClientRect());
    const currentRect = rects[current];

    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (pointInRect({x, y}, rect)) {

            const horizontal = rects.some((rectA, i) => rects.slice(i + 1).some(rectB => rectA.right <= rectB.left));

            return horizontal
                ? currentRect.bottom < rect.top || currentRect.top < rect.bottom && currentRect.bottom > rect.top && x > rect.left + rect.width / 2
                    ? i + 1
                    : i
                : y > rect.top + rect.height / 2
                    ? i + 1
                    : i;
        }
    }

    return -1;
}
