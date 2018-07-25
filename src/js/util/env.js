/* global DocumentTouch */
import {attr} from './attr';

export const isIE = /msie|trident/i.test(window.navigator.userAgent);
export const isRtl = attr(document.documentElement, 'dir') === 'rtl';

const hasTouchEvents = 'ontouchstart' in window;
const hasPointerEvents = window.PointerEvent;
export const hasTouch = hasTouchEvents
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' : `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';
