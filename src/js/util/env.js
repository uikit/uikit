import { attr } from './attr';

export const inBrowser = typeof window !== 'undefined';
export const isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';

export const hasTouch = inBrowser && 'ontouchstart' in window;
const hasPointerEvents = inBrowser && window.PointerEvent;

export const pointerDown = hasPointerEvents ? 'pointerdown' : hasTouch ? 'touchstart' : 'mousedown';
export const pointerMove = hasPointerEvents ? 'pointermove' : hasTouch ? 'touchmove' : 'mousemove';
export const pointerUp = hasPointerEvents ? 'pointerup' : hasTouch ? 'touchend' : 'mouseup';
export const pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouch ? '' : 'mouseenter';
export const pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouch ? '' : 'mouseleave';
export const pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';
