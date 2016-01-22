export const hasTouch =
    ('ontouchstart' in window) ||
    (window.DocumentTouch && document instanceof DocumentTouch)  ||
    (navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0) || //IE 10
    (navigator.pointerEnabled && navigator.maxTouchPoints > 0); //IE >=11
