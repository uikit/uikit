import Animate from '../mixin/animate';
import Class from '../mixin/class';
import {
    $,
    $$,
    addClass,
    append,
    assign,
    attr,
    before,
    children,
    css,
    findIndex,
    getEventPos,
    hasTouch,
    height,
    index,
    isEmpty,
    isInput,
    isTag,
    off,
    offsetViewport,
    on,
    parent,
    pointerDown,
    pointerMove,
    pointerUp,
    pointInRect,
    remove,
    removeClass,
    scrollParents,
    toggleClass,
    Transition,
    trigger,
    within,
} from 'uikit-util';

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
        handle: String,
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
        pos: {},
    },

    created() {
        for (const key of ['init', 'start', 'move', 'end']) {
            const fn = this[key];
            this[key] = (e) => {
                assign(this.pos, getEventPos(e));
                fn(e);
            };
        }
    },

    events: {
        name: pointerDown,
        passive: false,
        handler: 'init',
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

            immediate: true,
        },

        handles: {
            get({ handle }, el) {
                return handle ? $$(handle, el) : this.items;
            },

            watch(handles, prev) {
                css(prev, { touchAction: '', userSelect: '' });
                css(handles, { touchAction: hasTouch ? 'none' : '', userSelect: 'none' }); // touchAction set to 'none' causes a performance drop in Chrome 80
            },

            immediate: true,
        },
    },

    update: {
        write(data) {
            if (!this.drag || !parent(this.placeholder)) {
                return;
            }

            const {
                pos: { x, y },
                origin: { offsetTop, offsetLeft },
                placeholder,
            } = this;

            css(this.drag, {
                top: y - offsetTop,
                left: x - offsetLeft,
            });

            const sortable = this.getSortable(document.elementFromPoint(x, y));

            if (!sortable) {
                return;
            }

            const { items } = sortable;

            if (items.some(Transition.inProgress)) {
                return;
            }

            const target = findTarget(items, { x, y });

            if (items.length && (!target || target === placeholder)) {
                return;
            }

            const previous = this.getSortable(placeholder);
            const insertTarget = findInsertTarget(
                sortable.target,
                target,
                placeholder,
                x,
                y,
                sortable === previous && data.moved !== target
            );

            if (insertTarget === false) {
                return;
            }

            if (insertTarget && placeholder === insertTarget) {
                return;
            }

            if (sortable !== previous) {
                previous.remove(placeholder);
                data.moved = target;
            } else {
                delete data.moved;
            }

            sortable.insert(placeholder, insertTarget);

            this.touched.add(sortable);
        },

        events: ['move'],
    },

    methods: {
        init(e) {
            const { target, button, defaultPrevented } = e;
            const [placeholder] = this.items.filter((el) => within(target, el));

            if (
                !placeholder ||
                defaultPrevented ||
                button > 0 ||
                isInput(target) ||
                within(target, `.${this.clsNoDrag}`) ||
                (this.handle && !within(target, this.handle))
            ) {
                return;
            }

            e.preventDefault();

            this.touched = new Set([this]);
            this.placeholder = placeholder;
            this.origin = { target, index: index(placeholder), ...this.pos };

            on(document, pointerMove, this.move);
            on(document, pointerUp, this.end);

            if (!this.threshold) {
                this.start(e);
            }
        },

        start(e) {
            this.drag = appendDrag(this.$container, this.placeholder);
            const { left, top } = this.placeholder.getBoundingClientRect();
            assign(this.origin, { offsetLeft: this.pos.x - left, offsetTop: this.pos.y - top });

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
            } else if (
                Math.abs(this.pos.x - this.origin.x) > this.threshold ||
                Math.abs(this.pos.y - this.origin.y) > this.threshold
            ) {
                this.start(e);
            }
        },

        end() {
            off(document, pointerMove, this.move);
            off(document, pointerUp, this.end);

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

            for (const { clsPlaceholder, clsItem } of this.touched) {
                for (const sortable of this.touched) {
                    removeClass(sortable.items, clsPlaceholder, clsItem);
                }
            }
            this.touched = null;
            removeClass(document.documentElement, this.clsDragState);
        },

        insert(element, target) {
            addClass(this.items, this.clsItem);

            const insert = () => (target ? before(target, element) : append(this.target, element));

            this.animate(insert);
        },

        remove(element) {
            if (!within(element, this.target)) {
                return;
            }

            this.animate(() => remove(element));
        },

        getSortable(element) {
            do {
                const sortable = this.$getComponent(element, 'sortable');

                if (
                    sortable &&
                    (sortable === this || (this.group !== false && sortable.group === this.group))
                ) {
                    return sortable;
                }
            } while ((element = parent(element)));
        },
    },
};

let trackTimer;
function trackScroll(pos) {
    let last = Date.now();
    trackTimer = setInterval(() => {
        let { x, y } = pos;
        y += document.scrollingElement.scrollTop;

        const dist = (Date.now() - last) * 0.3;
        last = Date.now();

        scrollParents(document.elementFromPoint(x, pos.y), /auto|scroll/)
            .reverse()
            .some((scrollEl) => {
                let { scrollTop: scroll, scrollHeight } = scrollEl;

                const { top, bottom, height } = offsetViewport(scrollEl);

                if (top < y && top + 35 > y) {
                    scroll -= dist;
                } else if (bottom > y && bottom - 35 < y) {
                    scroll += dist;
                } else {
                    return;
                }

                if (scroll > 0 && scroll < scrollHeight - height) {
                    scrollEl.scrollTop = scroll;
                    return true;
                }
            });
    }, 15);
}

function untrackScroll() {
    clearInterval(trackTimer);
}

function appendDrag(container, element) {
    let clone;
    if (isTag(element, 'li', 'tr')) {
        clone = $('<div>');
        append(clone, element.cloneNode(true).children);
        for (const attribute of element.getAttributeNames()) {
            attr(clone, attribute, element.getAttribute(attribute));
        }
    } else {
        clone = element.cloneNode(true);
    }

    append(container, clone);

    css(clone, 'margin', '0', 'important');
    css(clone, {
        boxSizing: 'border-box',
        width: element.offsetWidth,
        height: element.offsetHeight,
        padding: css(element, 'padding'),
    });

    height(clone.firstElementChild, height(element.firstElementChild));

    return clone;
}

function findTarget(items, point) {
    return items[findIndex(items, (item) => pointInRect(point, item.getBoundingClientRect()))];
}

function findInsertTarget(list, target, placeholder, x, y, sameList) {
    if (!children(list).length) {
        return;
    }

    const rect = target.getBoundingClientRect();
    if (!sameList) {
        if (!isHorizontal(list, placeholder)) {
            return y < rect.top + rect.height / 2 ? target : target.nextElementSibling;
        }

        return target;
    }

    const placeholderRect = placeholder.getBoundingClientRect();
    const sameRow = linesIntersect(
        [rect.top, rect.bottom],
        [placeholderRect.top, placeholderRect.bottom]
    );

    const pointerPos = sameRow ? x : y;
    const lengthProp = sameRow ? 'width' : 'height';
    const startProp = sameRow ? 'left' : 'top';
    const endProp = sameRow ? 'right' : 'bottom';

    const diff =
        placeholderRect[lengthProp] < rect[lengthProp]
            ? rect[lengthProp] - placeholderRect[lengthProp]
            : 0;

    if (placeholderRect[startProp] < rect[startProp]) {
        if (diff && pointerPos < rect[startProp] + diff) {
            return false;
        }

        return target.nextElementSibling;
    }

    if (diff && pointerPos > rect[endProp] - diff) {
        return false;
    }

    return target;
}

function isHorizontal(list, placeholder) {
    const single = children(list).length === 1;

    if (single) {
        append(list, placeholder);
    }

    const items = children(list);
    const isHorizontal = items.some((el, i) => {
        const rectA = el.getBoundingClientRect();
        return items.slice(i + 1).some((el) => {
            const rectB = el.getBoundingClientRect();
            return !linesIntersect([rectA.left, rectA.right], [rectB.left, rectB.right]);
        });
    });

    if (single) {
        remove(placeholder);
    }

    return isHorizontal;
}

function linesIntersect(lineA, lineB) {
    return lineA[1] > lineB[0] && lineB[1] > lineA[0];
}
