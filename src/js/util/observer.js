import { on } from './event';
import { toNodes } from './lang';
import { inBrowser } from './env';

export function observeIntersection(targets, cb, options, intersecting = true) {
    const observer = new IntersectionObserver(
        intersecting
            ? (entries, observer) => {
                  if (entries.some((entry) => entry.isIntersecting)) {
                      cb(entries, observer);
                  }
              }
            : cb,
        options
    );
    for (const el of toNodes(targets)) {
        observer.observe(el);
    }

    return observer;
}

const hasResizeObserver = inBrowser && window.ResizeObserver;
export function observeResize(targets, cb, options = { box: 'border-box' }) {
    if (hasResizeObserver) {
        return observe(ResizeObserver, targets, cb, options);
    }

    // Fallback Safari < 13.1
    initResizeListener();
    listeners.add(cb);

    return {
        disconnect() {
            listeners.delete(cb);
        },
    };
}

let listeners;
function initResizeListener() {
    if (listeners) {
        return;
    }

    listeners = new Set();

    // throttle 'resize'
    let pendingResize;
    const handleResize = () => {
        if (pendingResize) {
            return;
        }
        pendingResize = true;
        requestAnimationFrame(() => (pendingResize = false));
        for (const listener of listeners) {
            listener();
        }
    };

    on(window, 'load resize', handleResize);
    on(document, 'loadedmetadata load', handleResize, true);
}

export function observeMutation(targets, cb, options) {
    return observe(MutationObserver, targets, cb, options);
}

function observe(Observer, targets, cb, options) {
    const observer = new Observer(cb);
    for (const el of toNodes(targets)) {
        observer.observe(el, options);
    }

    return observer;
}
