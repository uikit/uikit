import {
    getEventPos,
    isTouch,
    once,
    parent,
    pointerCancel,
    pointerDown,
    pointerUp,
    trigger,
} from 'uikit-util';
import { registerEvent } from '../api/state';

export default {
    props: {
        swiping: Boolean,
    },

    data: {
        swiping: true,
    },

    computed: {
        swipeTarget(props, $el) {
            return $el;
        },
    },

    connected() {
        if (!this.swiping) {
            return;
        }

        registerEvent(this, {
            el: this.swipeTarget,
            name: pointerDown,
            passive: true,
            handler(e) {
                if (!isTouch(e)) {
                    return;
                }

                // Handle Swipe Gesture
                const pos = getEventPos(e);
                const target = 'tagName' in e.target ? e.target : parent(e.target);
                once(document, `${pointerUp} ${pointerCancel} scroll`, (e) => {
                    const { x, y } = getEventPos(e);

                    // swipe
                    if (
                        (e.type !== 'scroll' && target && x && Math.abs(pos.x - x) > 100) ||
                        (y && Math.abs(pos.y - y) > 100)
                    ) {
                        setTimeout(() => {
                            trigger(target, 'swipe');
                            trigger(target, `swipe${swipeDirection(pos.x, pos.y, x, y)}`);
                        });
                    }
                });
            },
        });
    },
};

function swipeDirection(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
        ? x1 - x2 > 0
            ? 'Left'
            : 'Right'
        : y1 - y2 > 0
        ? 'Up'
        : 'Down';
}
