import { css, getEventPos, matches, on, once, scrollParents, width } from 'uikit-util';

let prevented;
export function preventBackgroundScroll(el) {
    // 'overscroll-behavior: contain' only works consistently if el overflows (Safari)
    const off = on(
        el,
        'touchstart',
        (e) => {
            if (e.targetTouches.length !== 1 || matches(e.target, 'input[type="range"')) {
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

            once(el, 'scroll touchend touchcanel', offMove, { capture: true });
        },
        { passive: true },
    );

    if (prevented) {
        return off;
    }
    prevented = true;

    const { scrollingElement } = document;
    css(scrollingElement, {
        overflowY: CSS.supports('overflow', 'clip') ? 'clip' : 'hidden',
        touchAction: 'none',
        paddingRight: width(window) - scrollingElement.clientWidth || '',
    });
    return () => {
        prevented = false;
        off();
        css(scrollingElement, { overflowY: '', touchAction: '', paddingRight: '' });
    };
}
