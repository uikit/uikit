import {
    $$,
    getEventPos,
    isFunction,
    isTouch,
    noop,
    observeIntersection,
    observeMutation,
    observeResize,
    observeViewportResize,
    on,
    once,
    parent,
    pointerCancel,
    pointerDown,
    pointerUp,
    removeAttr,
    scrollParent,
    toNodes,
    trigger,
} from 'uikit-util';
import { callUpdate } from './update';

export function resize(options) {
    return observe(observeResize, options, 'resize');
}

export function intersection(options) {
    return observe(observeIntersection, options);
}

export function mutation(options) {
    return observe(observeMutation, options);
}

export function lazyload(options = {}) {
    return intersection({
        handler: function (entries, observer) {
            const { targets = this.$el, preload = 5 } = options;
            for (const el of toNodes(isFunction(targets) ? targets(this) : targets)) {
                $$('[loading="lazy"]', el)
                    .slice(0, preload - 1)
                    .forEach((el) => removeAttr(el, 'loading'));
            }

            for (const el of entries
                .filter(({ isIntersecting }) => isIntersecting)
                .map(({ target }) => target)) {
                observer.unobserve(el);
            }
        },
        ...options,
    });
}

export function viewport(options) {
    return observe((target, handler) => observeViewportResize(handler), options, 'resize');
}

export function scroll(options) {
    return observe(
        (target, handler) => ({
            disconnect: on(toScrollTargets(target), 'scroll', handler, { passive: true }),
        }),
        options,
        'scroll',
    );
}

export function swipe(options) {
    return {
        observe(target, handler) {
            return {
                observe: noop,
                unobserve: noop,
                disconnect: on(target, pointerDown, handler, { passive: true }),
            };
        },
        handler(e) {
            if (!isTouch(e)) {
                return;
            }

            // Handle Swipe Gesture
            const pos = getEventPos(e);
            const target = 'tagName' in e.target ? e.target : parent(e.target);
            once(document, `${pointerUp} ${pointerCancel} scroll`, (e) => {
                const { x, y } = getEventPos(e);

                // swipe
                if (
                    (e.type !== 'scroll' && target && x && Math.abs(pos.x - x) > 100) ||
                    (y && Math.abs(pos.y - y) > 100)
                ) {
                    setTimeout(() => {
                        trigger(target, 'swipe');
                        trigger(target, `swipe${swipeDirection(pos.x, pos.y, x, y)}`);
                    });
                }
            });
        },
        ...options,
    };
}

function observe(observe, options, emit) {
    return {
        observe,
        handler() {
            callUpdate(this, emit);
        },
        ...options,
    };
}

function swipeDirection(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
        ? x1 - x2 > 0
            ? 'Left'
            : 'Right'
        : y1 - y2 > 0
          ? 'Up'
          : 'Down';
}

function toScrollTargets(elements) {
    return toNodes(elements).map((node) => {
        const { ownerDocument } = node;
        const parent = scrollParent(node, true);
        return parent === ownerDocument.scrollingElement ? ownerDocument : parent;
    });
}
