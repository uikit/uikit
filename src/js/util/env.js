export const hasTouch =
    ('ontouchstart' in window) ||
    (window.DocumentTouch && document instanceof DocumentTouch) ||
    (navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0) || //IE 10
    (navigator.pointerEnabled && navigator.maxTouchPoints > 0); //IE >=11

export const hasAnimation = (function () {

    var element = document.body || document.documentElement,
        names = {
            WebkitAnimation: 'webkitAnimationEnd',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd oanimationend',
            animation: 'animationend'
        }, name;

    for (name in names) {
        if (element.style[name] !== undefined) {
            return {end: names[name]};
        }
    }

})();
