/* global DocumentTouch */
import {attr} from './attr';
import {Promise} from './promise';

export const win = window;
export const doc = document;
export const docEl = doc.documentElement;

export const isRtl = attr(docEl, 'dir') === 'rtl';

export const Observer = win.MutationObserver;

const hasTouchEvents = 'ontouchstart' in win;
const hasPointerEvents = win.PointerEvent;
export const hasTouch = hasTouchEvents
    || win.DocumentTouch && doc instanceof DocumentTouch
    || navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' : `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

export function getImage(src) {

    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onerror = reject;
        img.onload = () => resolve(img);

        img.src = src;
    });

}

export const supports = {};

// IE 11
(function () {

    let list = doc.createElement('_').classList;
    if (list) {
        list.add('a', 'b');
        list.toggle('c', false);
        supports.Multiple = list.contains('b');
        supports.Force = !list.contains('c');
        supports.ClassList = true;
    }
    list = null;

})();
