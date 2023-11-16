import { isArray, isFunction, isString, toNode, toNodes } from './lang';
import { findAll } from './selector';

export function on(...args) {
    let [targets, types, selector, listener, useCapture = false] = getArgs(args);

    if (listener.length > 1) {
        listener = detail(listener);
    }

    if (useCapture?.self) {
        listener = selfFilter(listener);
    }

    if (selector) {
        listener = delegate(selector, listener);
    }

    for (const type of types) {
        for (const target of targets) {
            target.addEventListener(type, listener, useCapture);
        }
    }

    return () => off(targets, types, listener, useCapture);
}

export function off(...args) {
    let [targets, types, , listener, useCapture = false] = getArgs(args);
    for (const type of types) {
        for (const target of targets) {
            target.removeEventListener(type, listener, useCapture);
        }
    }
}

export function once(...args) {
    const [element, types, selector, listener, useCapture = false, condition] = getArgs(args);
    const off = on(
        element,
        types,
        selector,
        (e) => {
            const result = !condition || condition(e);
            if (result) {
                off();
                listener(e, result);
            }
        },
        useCapture,
    );

    return off;
}

export function trigger(targets, event, detail) {
    return toEventTargets(targets).every((target) =>
        target.dispatchEvent(createEvent(event, true, true, detail)),
    );
}

export function createEvent(e, bubbles = true, cancelable = false, detail) {
    if (isString(e)) {
        e = new CustomEvent(e, { bubbles, cancelable, detail });
    }

    return e;
}

function getArgs(args) {
    // Event targets
    args[0] = toEventTargets(args[0]);

    // Event types
    if (isString(args[1])) {
        args[1] = args[1].split(' ');
    }

    // Delegate?
    if (isFunction(args[2])) {
        args.splice(2, 0, false);
    }

    return args;
}

function delegate(selector, listener) {
    return (e) => {
        const current =
            selector[0] === '>'
                ? findAll(selector, e.currentTarget)
                      .reverse()
                      .find((element) => element.contains(e.target))
                : e.target.closest(selector);

        if (current) {
            e.current = current;
            listener.call(this, e);
            delete e.current;
        }
    };
}

function detail(listener) {
    return (e) => (isArray(e.detail) ? listener(e, ...e.detail) : listener(e));
}

function selfFilter(listener) {
    return function (e) {
        if (e.target === e.currentTarget || e.target === e.current) {
            return listener.call(null, e);
        }
    };
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
    const { clientX: x, clientY: y } = e.touches?.[0] || e.changedTouches?.[0] || e;

    return { x, y };
}
