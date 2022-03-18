import { on } from 'uikit-util';

export default {
    connected() {
        registerScrollListener(this._uid, () => this.$emit('scroll'));
    },

    disconnected() {
        unregisterScrollListener(this._uid);
    },
};

const scrollListeners = new Map();
let unbindScrollListener;
function registerScrollListener(id, listener) {
    unbindScrollListener =
        unbindScrollListener ||
        on(window, 'scroll', () => scrollListeners.forEach((listener) => listener()), {
            passive: true,
            capture: true,
        });

    scrollListeners.set(id, listener);
}

function unregisterScrollListener(id) {
    scrollListeners.delete(id);
    if (unbindScrollListener && !scrollListeners.size) {
        unbindScrollListener();
        unbindScrollListener = null;
    }
}
