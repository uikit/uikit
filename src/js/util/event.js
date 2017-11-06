import { $, $$, closest, doc, isArray, isFunction, isString, toNode, toNodes, win, within } from './index';

export function on(...args) {

    var [target, type, selector, listener, useCapture] = getArgs(args);

    target = toEventTarget(target);

    if (selector) {
        listener = delegate(target, selector, listener);
    }

    if (listener.length > 1) {
        listener = detail(listener);
    }

    type.split(' ').forEach(type => target.addEventListener(type, listener, useCapture));
    return () => off(target, type, listener, useCapture);
}

export function off(target, type, listener, useCapture = false) {
    type.split(' ').forEach(type => toEventTarget(target).removeEventListener(type, listener, useCapture));
}

export function once(...args) {

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

export function trigger(target, event, detail) {
    return toEventTargets(target).reduce((notCanceled, target) =>
        notCanceled && target.dispatchEvent(createEvent(event, true, true, detail))
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

    if (isString(args[0])) {
        args[0] = $(args[0]);
    }

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

function detail(listener) {
    return e => isArray(e.detail) ? listener.apply(listener, [e].concat(e.detail)) : listener(e);
}

function isEventTarget(target) {
    return 'EventTarget' in win
        ? target instanceof EventTarget
        : 'addEventListener' in target;
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
