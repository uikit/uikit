import { toNodes } from './lang';

// Old chromium based browsers (UC Browser) did not implement `isIntersecting`
export const hasIntersectionObserver =
    window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype;
export function observeIntersection(targets, cb, options, intersecting = true) {
    if (!hasIntersectionObserver) {
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        if (!intersecting || entries.some((entry) => entry.isIntersecting)) {
            cb(entries, observer);
        }
    }, options);
    for (const el of toNodes(targets)) {
        observer.observe(el);
    }
    return observer;
}

const hasResizeObserver = window.ResizeObserver;
export function observeResize(targets, cb, options = { box: 'border-box' }) {
    if (!hasResizeObserver) {
        return;
    }

    const observer = new ResizeObserver((entries, observer) => {
        cb(entries, observer);
    });
    for (const el of toNodes(targets)) {
        observer.observe(el, options);
    }

    return observer;
}
