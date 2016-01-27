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

export const nextTick = (function () {
    var callbacks = [],
        pending = false,
        timerFunc;

    function nextTickHandler () {
        pending = false;
        var copies = callbacks.slice(0);
        callbacks = [];
        for (var i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }

    /* istanbul ignore if */
    if (typeof MutationObserver !== 'undefined') {

        var counter = 1,
            observer = new MutationObserver(nextTickHandler),
            textNode = document.createTextNode(counter);

        observer.observe(textNode, {characterData: true});

        timerFunc = function () {
            counter = (counter + 1) % 2;
            textNode.data = counter
        }

    } else {
        timerFunc = setTimeout
    }

    return function (cb, ctx) {

        var func = ctx ? function () { cb.call(ctx) } : cb;

        callbacks.push(func);

        if (pending) {
            return;
        }

        pending = true;
        timerFunc(nextTickHandler, 0)
    }
})();
