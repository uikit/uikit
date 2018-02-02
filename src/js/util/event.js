import {within} from './filter';
import {closest, find, findAll} from './selector';
import {isArray, isFunction, isString, toNode, toNodes} from './lang';

export function on(...args) {

    let [target, type, selector, listener, useCapture] = getArgs(args);

    target = toEventTarget(target);

    if (selector) {
        listener = delegate(target, selector, listener);
    }

    if (listener.length > 1) {
        listener = detail(listener);
    }

    type.split(' ').forEach(type => target && target.addEventListener(type, listener, useCapture));
    return () => off(target, type, listener, useCapture);
}

export function off(target, type, listener, useCapture = false) {
    target = toEventTarget(target);
    target && type.split(' ').forEach(type => target.removeEventListener(type, listener, useCapture));
}

export function once(...args) {

    const [element, type, selector, listener, useCapture, condition] = getArgs(args);
    const off = on(element, type, selector, e => {
        const result = !condition || condition(e);
        if (result) {
            off();
            listener(e, result);
        }
    }, useCapture);

    return off;
}

export function trigger(target, event, detail) {
    return toEventTargets(target).reduce((notCanceled, target) =>
        notCanceled && target.dispatchEvent(createEvent(event, true, true, detail))
        , true);
}

export function createEvent(e, bubbles = true, cancelable = false, detail) {
    if (isString(e)) {
        const event = document.createEvent('CustomEvent'); // IE 11
        event.initCustomEvent(e, bubbles, cancelable, detail);
        e = event;
    }

    return e;
}

function getArgs(args) {

    if (isString(args[0])) {
        args[0] = find(args[0]);
    }

    if (isFunction(args[2])) {
        args.splice(2, 0, false);
    }
    return args;
}

function delegate(element, selector, listener) {
    return e => {

        const {target} = e;
        const current = selector[0] === '>'
            ? findAll(selector, element).reverse().filter(element => within(target, element))[0]
            : closest(target, selector);

        if (current) {
            e.delegate = element;
            e.current = current;

            listener.call(this, e);
        }
    };
}

function detail(listener) {
    return e => isArray(e.detail) ? listener.apply(listener, [e].concat(e.detail)) : listener(e);
}

function isEventTarget(target) {
    return 'EventTarget' in window
        ? target instanceof EventTarget
        : target && 'addEventListener' in target;
}

function toEventTarget(target) {
    return isEventTarget(target) ? target : toNode(target);
}

export function toEventTargets(target) {
    return isEventTarget(target)
        ? [target]
        : isArray(target)
            ? target.map(toEventTarget).filter(Boolean)
            : toNodes(target);
}

export function preventClick() {

    const timer = setTimeout(once(document, 'click', e => {

        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(timer);

    }, true));

}
