import {
    getEventPos,
    hasClass,
    isInput,
    isTouch,
    on,
    once,
    pointerCancel,
    pointerDown,
    pointerMove,
    pointerUp,
    selInput,
} from 'uikit-util';

export default {
    data: {
        threshold: 5,
    },

    events: {
        name: pointerDown,

        handler: handleMouseDrag,
    },
};

function handleMouseDrag(e) {
    const { target, button, defaultPrevented } = e;

    if (
        defaultPrevented ||
        button > 0 ||
        isTouch(e) ||
        target.closest(selInput) ||
        isInput(target)
    ) {
        return;
    }

    e.preventDefault();

    const pointerOptions = { passive: false, capture: true };
    const { $el: el, threshold } = this;
    let started;

    const isVertical = hasClass(el, 'uk-overflow-fade-vertical');
    const prop = isVertical ? 'y' : 'x';
    const origin = getEventPos(e);
    let pos = origin;

    const off = on(document, pointerMove, move, pointerOptions);
    once(document, [pointerUp, pointerCancel], end, true);

    function move(e) {
        const lastPos = pos;
        pos = getEventPos(e);

        started ||= Math.abs(pos[prop] - origin[prop]) > threshold;

        if (started) {
            el[isVertical ? 'scrollTop' : 'scrollLeft'] += lastPos[prop] - pos[prop];
        }
    }

    function end() {
        off();

        if (started) {
            setTimeout(on(el, 'click', (e) => e.preventDefault(), pointerOptions));
        }
    }
}
