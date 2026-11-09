export const inBrowser = typeof window !== 'undefined';
export const isRtl = inBrowser && document.dir === 'rtl';

export const pointerDown = 'pointerdown';
export const pointerMove = 'pointermove';
export const pointerUp = 'pointerup';
export const pointerEnter = 'pointerenter';
export const pointerLeave = 'pointerleave';
export const pointerCancel = 'pointercancel';
