import { pointerCancel, pointerDown, pointerUp } from '../util/env';
import { on, once } from '../util/event';
import { keyMap } from '../util/keys';

export function maybeDefaultPreventClick(e) {
    if (e.target.closest('a[href="#"],a[href=""]')) {
        e.preventDefault();
    }
}

export function onEscape(handler, isEligible = () => true) {
    return on(document, 'keydown', (e) => {
        if (e.keyCode === keyMap.ESC && isEligible()) {
            handler(e);
        }
    });
}

export function onOutsidePointer(handler, isOutside, isEligible) {
    return on(document, pointerDown, ({ target }) => {
        if (!isOutside(target) || (isEligible && !isEligible())) {
            return;
        }

        once(
            document,
            `${pointerUp} ${pointerCancel} scroll`,
            ({ defaultPrevented, type, target: newTarget }) => {
                if (!defaultPrevented && type === pointerUp && target === newTarget) {
                    handler(target);
                }
            },
            true,
        );
    });
}
