/* global DocumentTouch */
import {attr} from './attr';

export const isIE = /msie|trident/i.test(window.navigator.userAgent);
export const isRtl = attr(document.documentElement, 'dir') === 'rtl';

const hasTouchEvents = 'ontouchstart' in window;
const hasPointerEvents = window.PointerEvent;
export const hasTouch = hasTouchEvents
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.maxTouchPoints; // IE >=11

export const pointerDown = hasPointerEvents ? 'pointerdown' : hasTouchEvents ? 'touchstart' : 'mousedown';
export const pointerMove = hasPointerEvents ? 'pointermove' : hasTouchEvents ? 'touchmove' : 'mousemove';
export const pointerUp = hasPointerEvents ? 'pointerup' : hasTouchEvents ? 'touchend' : 'mouseup';
export const pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouchEvents ? '' : 'mouseenter';
export const pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouchEvents ? '' : 'mouseleave';
export const pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';

