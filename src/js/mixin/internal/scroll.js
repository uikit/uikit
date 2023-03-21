import { css, matches, on, scrollParents, width } from 'uikit-util';

let prevented;
export function preventBackgroundScroll(el) {
    // 'overscroll-behavior: contain' only works consistently if el overflows (Safari)
    const off = on(
        el,
        'touchmove',
        (e) => {
            if (e.targetTouches.length !== 1 || matches(e.target, 'input[type="range"')) {
                return;
            }

            let [{ scrollHeight, clientHeight }] = scrollParents(e.target);

            if (clientHeight >= scrollHeight && e.cancelable) {
                e.preventDefault();
            }
        },
        { passive: false }
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
