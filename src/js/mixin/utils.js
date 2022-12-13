import { $, $$, css, on, scrollParents, width } from 'uikit-util';

export function getMaxPathLength(el) {
    return Math.ceil(
        Math.max(
            0,
            ...$$('[stroke]', el).map((stroke) => {
                try {
                    return stroke.getTotalLength();
                } catch (e) {
                    return 0;
                }
            })
        )
    );
}

let prevented;
export function preventBackgroundScroll(el) {
    // 'overscroll-behavior: contain' only works consistently if el overflows (Safari)
    const off = on(
        el,
        'touchmove',
        (e) => {
            if (e.targetTouches.length !== 1) {
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

export function isSameSiteAnchor(el) {
    return ['origin', 'pathname', 'search'].every((part) => el[part] === location[part]);
}

export function getTargetElement(el) {
    if (isSameSiteAnchor(el)) {
        const id = decodeURIComponent(el.hash).substring(1);
        return document.getElementById(id) || document.getElementsByName(id)[0];
    }
}

export function generateId(component, el = component.$el, postfix = '') {
    if (el.id) {
        return el.id;
    }

    let id = `${component.$options.id}-${component._uid}${postfix}`;

    if ($(`#${id}`)) {
        id = generateId(component, el, `${postfix}-2`);
    }

    return id;
}

export const keyMap = {
    TAB: 9,
    ESC: 27,
    SPACE: 32,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};
