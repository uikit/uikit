import { classify } from './lang';

export const Observer = window.MutationObserver || window.WebKitMutationObserver;
export const requestAnimationFrame = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60); };
export const cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

export const hasPromise = 'Promise' in window;
export const hasTouch = 'ontouchstart' in window
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints > 0; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : window.PointerEvent ? 'pointerdown' : 'touchstart';
export const pointerMove = !hasTouch ? 'mousemove' : window.PointerEvent ? 'pointermove' : 'touchmove';
export const pointerUp = !hasTouch ? 'mouseup' : window.PointerEvent ? 'pointerup' : 'touchend';
export const pointerEnter = hasTouch && window.PointerEvent ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && window.PointerEvent ? 'pointerleave' : 'mouseleave';

export const transitionstart = prefix('transition', 'transition-start');
export const transitionend = prefix('transition', 'transition-end');
export const animationstart = prefix('animation', 'animation-start');
export const animationend = prefix('animation', 'animation-end');

export function getStyle(element, property, pseudoElt) {
    return (window.getComputedStyle(element, pseudoElt) || {})[property];
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

function prefix(name, event) {

    var ucase = classify(name),
        lowered = classify(event).toLowerCase(),
        classified = classify(event),
        element = document.body || document.documentElement,
        names = {
            [`Webkit${ucase}`]: `webkit${classified}`,
            [`Moz${ucase}`]: lowered,
            [`o${ucase}`]: `o${classified} o${lowered}`,
            [name]: lowered
        };

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }
}
