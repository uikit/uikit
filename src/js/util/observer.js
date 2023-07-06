import { inBrowser } from './env';
import { on } from './event';
import { toNodes } from './lang';

export function observeIntersection(targets, cb, options = {}, { intersecting = true } = {}) {
    const observer = new IntersectionObserver(
        intersecting
            ? (entries, observer) => {
                  if (entries.some((entry) => entry.isIntersecting)) {
                      cb(entries, observer);
                  }
              }
            : cb,
        options,
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
    const off = [on(window, 'load resize', cb), on(document, 'loadedmetadata load', cb, true)];
    return { disconnect: () => off.map((cb) => cb()) };
}

export function observeViewportResize(cb) {
    return { disconnect: on([window, window.visualViewport], 'resize', cb) };
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
