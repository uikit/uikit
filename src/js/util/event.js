import { closest, doc, isArray, isFunction, isString, toNode, toNodes } from './index';
import { $$, within } from "./selector";

export function on(...args) {

    var [element, type, selector, listener, useCapture] = getArgs(args);

    element = toNode(element);

    if (selector) {
        listener = delegate(element, selector, listener);
    }

    if (listener.length > 1) {
        listener = details(listener);
    }

    type.split(' ').forEach(type => element.addEventListener(type, listener, useCapture));
    return () => off(element, type, listener, useCapture);
}

export function off(element, type, listener, useCapture = false) {
    type.split(' ').forEach(type => toNode(element).removeEventListener(type, listener, useCapture));
}

export function one(...args) {

    var [element, type, selector, listener, useCapture, condition] = getArgs(args),
        off = on(element, type, selector, e => {
            var result = !condition || condition(e);
            if (result) {
                off();
                listener(e, result);
            }
        }, useCapture);

    return off;
}

export function trigger(element, event, detail) {
    return toNodes(element).reduce((notCanceled, element) =>
        notCanceled && element.dispatchEvent(createEvent(event, true, true, detail))
    , true);
}

export function createEvent(e, bubbles = true, cancelable = false, detail) {
    if (isString(e)) {
        var event = doc.createEvent('CustomEvent');
        event.initCustomEvent(e, bubbles, cancelable, detail);
        e = event;
    }

    return e;
}

function getArgs(args) {
    if (isFunction(args[2])) {
        args.splice(2, 0, false);
    }
    return args;
}

function delegate(element, selector, listener) {
    return e => {

        var target = e.target,
            current = selector[0] === '>'
                ? $$(selector, element).filter(element => within(target, element))[0]
                : closest(target, selector);

        if (current) {
            e.delegate = element;
            e.current = current;

            listener.call(this, e);
        }
    }
}

function details(listener) {
    return e => isArray(e.detail) ? listener.apply(listener, [e].concat(e.detail)) : listener(e);
}