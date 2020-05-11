/* global DocumentTouch */
import {attr} from './attr';

export const inBrowser = typeof window !== 'undefined';
export const isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
export const isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';

const hasTouchEvents = inBrowser && 'ontouchstart' in window;
const hasPointerEvents = inBrowser && window.PointerEvent;
export const hasTouch = inBrowser && (hasTouchEvents
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.maxTouchPoints); // IE >=11

export const pointerDown = hasPointerEvents ? 'pointerdown' : hasTouchEvents ? 'touchstart' : 'mousedown';
export const pointerMove = hasPointerEvents ? 'pointermove' : hasTouchEvents ? 'touchmove' : 'mousemove';
export const pointerUp = hasPointerEvents ? 'pointerup' : hasTouchEvents ? 'touchend' : 'mouseup';
export const pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouchEvents ? '' : 'mouseenter';
export const pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouchEvents ? '' : 'mouseleave';
export const pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';
