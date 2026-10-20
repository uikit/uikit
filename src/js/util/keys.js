export const keyMap = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

export function getNavigationIndex(keyCode, previousKey = keyMap.LEFT, nextKey = keyMap.RIGHT) {
    switch (keyCode) {
        case keyMap.HOME:
            return 0;
        case keyMap.END:
            return 'last';
        case previousKey:
            return 'previous';
        case nextKey:
            return 'next';
    }
    return -1;
}
