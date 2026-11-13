import {
    css,
    getEventPos,
    isTouch,
    on,
    once,
    pointerCancel,
    pointerMove,
    pointerUp,
    selInput,
    toArray,
} from 'uikit-util';

const pointerOptions = { passive: false, capture: true };

// Tracks a pointer drag along one axis, starting with the passed `pointerdown` event.
// Calls `move` with the movement since the last event, once the threshold is exceeded.
export function drag(e, el, { threshold = 5, touch, vertical, move, end }) {
    const { target, button, defaultPrevented } = e;

    if (defaultPrevented || button > 0 || (!touch && isTouch(e)) || target.closest(selInput)) {
        return false;
    }

    e.preventDefault();

    const prop = vertical ? 'y' : 'x';
    const origin = getEventPos(e)[prop];
    let pos = origin;
    let started;

    const off = on(
        document,
        pointerMove,
        (e) => {
            const prev = pos;
            pos = getEventPos(e)[prop];

            if ((started ||= Math.abs(pos - origin) > threshold)) {
                move(pos - prev, e);
            }
        },
        pointerOptions,
    );

    once(
        document,
        [pointerUp, pointerCancel],
        (e) => {
            off();

            if (started) {
                // Prevent the click that follows a drag
                setTimeout(on(el, 'click', (e) => e.preventDefault(), pointerOptions));
            }

            end?.(e);
        },
        true,
    );

    return true;
}

export function hasSelectableText(el) {
    return (
        css(el, 'userSelect') !== 'none' &&
        toArray(el.childNodes).some((el) => el.nodeType === 3 && el.textContent.trim())
    );
}
