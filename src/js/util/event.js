import $ from 'jquery';
import { Event, isContextSelector, isFunction, isString, matches, toJQuery, toNode } from './index';

export function on(...args) {

    var [element, type, selector, listener, useCapture] = getArgs(args);

    element = toNode(element);

    if (selector) {
        var fn = listener, contextSelector = isContextSelector(selector);
        listener = e => {

            var target = e.target;
            var query = contextSelector && toJQuery(selector, element);

            while (element !== target) {

                if (query && query.is(target) || !contextSelector && matches(target, selector)) {

                    e.delegate = element;
                    e.current = target;

                    fn(e);
                    break;
                }

                target = target.parentNode;
            }
        }
    }

    type.split(' ').forEach(type => element.addEventListener(type, listener, useCapture));
    return () => off(element, type, listener, useCapture);
}

export function off(element, type, listener, useCapture = false) {
    type.split(' ').forEach(type => toNode(element).removeEventListener(type, listener, useCapture));
}

export function one(...args) {

    var [element, type, selector, listener, useCapture, condition] = getArgs(args);

    var handler = e => {
        var result = !condition || condition(e);
        if (result) {
            off();
            listener(e, result);
        }
    };

    var off = on(element, type, selector, handler, useCapture);
}

export function trigger(element, event) {
    var e = createEvent(event);
    toNode(element).dispatchEvent(e);
    return e;
}

export function createEvent(e, bubbles = true, cancelable = false, detail) {
    if (isString(e)) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(e, bubbles, cancelable, detail);
        e = event;
    }

    return e;
}

export function $trigger(element, event, data, local = false) {
    var e = event instanceof Event ? event : Event(event);
    $(element)[local ? 'triggerHandler' : 'trigger'](e, data);
    return e;
}

function getArgs(args) {
    if (isFunction(args[2])) {
        args.splice(2, 0, false);
    }
    return args;
}
