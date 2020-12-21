import {isIE} from './env';
import {findAll} from './selector';
import {closest, within} from './filter';
import {isArray, isBoolean, isFunction, isString, toNode, toNodes} from './lang';

export function on(...args) {

    let [targets, type, selector, listener, useCapture] = getArgs(args);

    targets = toEventTargets(targets);

    if (listener.length > 1) {
        listener = detail(listener);
    }

    if (useCapture && useCapture.self) {
        listener = selfFilter(listener);
    }

    if (selector) {
        listener = delegate(selector, listener);
    }

    useCapture = useCaptureFilter(useCapture);

    type.split(' ').forEach(type =>
        targets.forEach(target =>
            target.addEventListener(type, listener, useCapture)
        )
    );
    return () => off(targets, type, listener, useCapture);
}

export function off(targets, type, listener, useCapture = false) {
    useCapture = useCaptureFilter(useCapture);
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

function delegate(selector, listener) {
    return e => {

        const current = selector[0] === '>'
            ? findAll(selector, e.currentTarget).reverse().filter(element => within(e.target, element))[0]
            : closest(e.target, selector);

        if (current) {
            e.current = current;
            listener.call(this, e);
        }

    };
}

function detail(listener) {
    return e => isArray(e.detail) ? listener(e, ...e.detail) : listener(e);
}

function selfFilter(listener) {
    return function (e) {
        if (e.target === e.currentTarget || e.target === e.current) {
            return listener.call(null, e);
        }
    };
}

function useCaptureFilter(options) {
    return options && isIE && !isBoolean(options)
        ? !!options.capture
        : options;
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
    return e.pointerType === 'touch' || !!e.touches;
}

export function getEventPos(e) {
    const {touches, changedTouches} = e;
    const {clientX: x, clientY: y} = touches && touches[0] || changedTouches && changedTouches[0] || e;

    return {x, y};
}
