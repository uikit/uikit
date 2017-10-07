import { classify, doc, docEl, Promise, win } from './index';

export const Observer = win.MutationObserver || win.WebKitMutationObserver;
export const requestAnimationFrame = win.requestAnimationFrame || (fn => setTimeout(fn, 1000 / 60));

var hasTouchEvents = 'ontouchstart' in win;
var hasPointerEvents = win.PointerEvent;
export const hasTouch = 'ontouchstart' in win
    || win.DocumentTouch && doc instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' : `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

export const transitionend = prefix('transition', 'transition-end');
export const animationstart = prefix('animation', 'animation-start');
export const animationend = prefix('animation', 'animation-end');

export function getImage(src) {

    return new Promise((resolve, reject) => {
        var img = new Image();

        img.onerror = reject;
        img.onload = () => resolve(img);

        img.src = src;
    });

}

function prefix(name, event) {

    var ucase = classify(name),
        lowered = classify(event).toLowerCase(),
        classified = classify(event),
        element = doc.body || docEl,
        names = {
            [name]: lowered,
            [`Webkit${ucase}`]: `webkit${classified}`,
            [`Moz${ucase}`]: lowered,
            [`o${ucase}`]: `o${classified} o${lowered}`
        };

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }
}
