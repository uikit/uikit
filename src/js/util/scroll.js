import { css, getEventPos, matches, on, once, resetProps, scrollParents, width } from 'uikit-util';

let scrollLocks = 0;
export function preventBackgroundScroll(el) {
    // 'overscroll-behavior: contain' only works consistently if el overflows (Safari)
    const off = on(
        el,
        'touchstart',
        (e) => {
            if (e.targetTouches.length !== 1 || matches(e.target, 'input[type="range"]')) {
                return;
            }

            let prev = getEventPos(e).y;

            const offMove = on(
                el,
                'touchmove',
                (e) => {
                    const pos = getEventPos(e).y;
                    if (pos === prev) {
                        return;
                    }
                    prev = pos;

                    if (
                        !scrollParents(e.target).some((scrollParent) => {
                            if (!el.contains(scrollParent)) {
                                return false;
                            }

                            let { scrollHeight, clientHeight } = scrollParent;
                            return clientHeight < scrollHeight;
                        })
                    ) {
                        e.preventDefault();
                    }
                },
                { passive: false },
            );

            once(el, 'scroll touchend touchcancel', offMove, { capture: true });
        },
        { passive: true },
    );

    const { scrollingElement } = document;
    const props = {
        overflowY: CSS.supports('overflow', 'clip') ? 'clip' : 'hidden',
        touchAction: 'none',
        scrollbarGutter: width(window) - scrollingElement.clientWidth ? 'stable' : '',
    };

    if (!scrollLocks++) {
        css(scrollingElement, props);
    }

    let released = false;
    return () => {
        if (released) {
            return;
        }
        released = true;
        off();
        if (!--scrollLocks) {
            resetProps(scrollingElement, props);
        }
    };
}
