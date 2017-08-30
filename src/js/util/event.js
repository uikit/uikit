import { doc, isContextSelector, isFunction, isString, matches, query, toNode } from './index';

export function on(...args) {

    var [element, type, selector, listener, useCapture] = getArgs(args);

    element = toNode(element);

    if (selector) {
        listener = delegate(element, selector, listener);
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
    var e = createEvent(event, true, true, detail);
    toNode(element).dispatchEvent(e);
    return e;
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
    var contextSelector = isContextSelector(selector);

    return e => {

        var target = e.target,
            queried = contextSelector && query(selector, element);

        while (element !== target) {

            if (queried && queried.is(target) || !contextSelector && matches(target, selector)) {

                e.delegate = element;
                e.current = target;

                listener.call(target, e);
                break;
            }

            target = target.parentNode;
        }
    }
}