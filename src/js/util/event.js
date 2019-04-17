import {within} from './filter';
import {closest, findAll} from './selector';
import {isArray, isFunction, isString, toNode, toNodes} from './lang';

export function on(...args) {

    let [targets, type, selector, listener, useCapture] = getArgs(args);

    targets = toEventTargets(targets);

    if (selector) {
        listener = delegate(targets, selector, listener);
    }

    if (listener.length > 1) {
        listener = detail(listener);
    }

    type.split(' ').forEach(type =>
        targets.forEach(target =>
            target.addEventListener(type, listener, useCapture)
        )
    );
    return () => off(targets, type, listener, useCapture);
}

export function off(targets, type, listener, useCapture = false) {
    targets = toEventTargets(targets);
    type.split(' ').forEach(type =>
        targets.forEach(target =>
            target.removeEventListener(type, listener, useCapture)
        )
    );
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

export function trigger(targets, event, detail) {
    return toEventTargets(targets).reduce((notCanceled, target) =>
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
    if (isFunction(args[2])) {
        args.splice(2, 0, false);
    }
    return args;
}

function delegate(delegates, selector, listener) {
    return e => {

        delegates.forEach(delegate => {

            const current = selector[0] === '>'
                ? findAll(selector, delegate).reverse().filter(element => within(e.target, element))[0]
                : closest(e.target, selector);

            if (current) {
                e.delegate = delegate;
                e.current = current;

                listener.call(this, e);
            }

        });

    };
}

function detail(listener) {
    return e => isArray(e.detail) ? listener(...[e].concat(e.detail)) : listener(e);
}

function isEventTarget(target) {
    return target && 'addEventListener' in target;
}

function toEventTarget(target) {
    return isEventTarget(target) ? target : toNode(target);
}

export function toEventTargets(target) {
    return isArray(target)
            ? target.map(toEventTarget).filter(Boolean)
            : isString(target)
                ? findAll(target)
                : isEventTarget(target)
                    ? [target]
                    : toNodes(target);
}

export function isTouch(e) {
    return e.pointerType === 'touch' || e.touches;
}

export function getEventPos(e, prop = 'client') {
    const {touches, changedTouches} = e;
    const {[`${prop}X`]: x, [`${prop}Y`]: y} = touches && touches[0] || changedTouches && changedTouches[0] || e;

    return {x, y};
}
