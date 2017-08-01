import { classify, promise, toNode } from './lang';

export const Observer = window.MutationObserver || window.WebKitMutationObserver;
export const requestAnimationFrame = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60); };

var hasTouchEvents = 'ontouchstart' in window;
var hasPointerEvents = window.PointerEvent;
export const hasPromise = 'Promise' in window;
export const hasTouch = 'ontouchstart' in window
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' :  `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

export const transitionend = prefix('transition', 'transition-end');
export const animationstart = prefix('animation', 'animation-start');
export const animationend = prefix('animation', 'animation-end');

export function getStyle(element, property, pseudoElt) {
    return (window.getComputedStyle(toNode(element), pseudoElt) || {})[property];
}

export function getCssVar(name) {

    /* usage in css:  .var-name:before { content:"xyz" } */

    var val, doc = document.documentElement,
        element = doc.appendChild(document.createElement('div'));

    element.classList.add(`var-${name}`);

    try {

        val = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
        val = JSON.parse(val);

    } catch (e) {}

    doc.removeChild(element);

    return val || undefined;
}

export function getImage(src) {

    return promise((resolve, reject) => {
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
        element = document.body || document.documentElement,
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
