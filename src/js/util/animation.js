import { addClass, hasClass, removeClass } from './class';
import { once, trigger } from './event';
import { toNodes } from './lang';
import { css, propName, resetProps } from './style';

const clsTransition = 'uk-transition';
const transitionEnd = 'transitionend';
const transitionCanceled = 'transitioncanceled';

function transition(element, props, duration = 400, timing = 'linear', skipReflow) {
    duration = Math.round(duration);
    return Promise.all(
        toNodes(element).map(
            (element) =>
                new Promise((resolve, reject) => {
                    if (!skipReflow) {
                        element.offsetHeight; // force reflow
                    }

                    const timer = setTimeout(() => trigger(element, transitionEnd), duration);

                    once(
                        element,
                        [transitionEnd, transitionCanceled],
                        ({ type }) => {
                            clearTimeout(timer);
                            removeClass(element, clsTransition);
                            resetProps(element, transitionProps);
                            type === transitionCanceled ? reject() : resolve(element);
                        },
                        { self: true },
                    );

                    addClass(element, clsTransition);
                    const transitionProps = {
                        transitionProperty: Object.keys(props).map(propName).join(','),
                        transitionDuration: `${duration}ms`,
                        transitionTimingFunction: timing,
                    };
                    css(element, { ...transitionProps, ...props });
                }),
        ),
    );
}

export const Transition = {
    start: transition,

    async stop(element) {
        trigger(element, transitionEnd);
        await Promise.resolve();
    },

    async cancel(element) {
        trigger(element, transitionCanceled);
        await Promise.resolve();
    },

    inProgress(element) {
        return hasClass(element, clsTransition);
    },
};

const clsAnimation = 'uk-animation';
const activeAnimations = new WeakMap();

function animate(element, animation, duration = 200, origin, out) {
    const animateFn = async (element) => {
        if (!Element.prototype.getAnimations) {
            return element;
        }

        cancel(element);

        const existingAnimations = element.getAnimations();

        const classes = [
            animation,
            clsAnimation,
            `${clsAnimation}-${out ? 'leave' : 'enter'}`,
            origin && `uk-transform-origin-${origin}`,
            out && `${clsAnimation}-reverse`,
        ];

        css(element, 'animationDuration', `${duration}ms`);
        addClass(element, classes);

        const animations = element
            .getAnimations()
            .filter((animation) => !existingAnimations.includes(animation));
        const data = { animations, classes };

        activeAnimations.set(element, data);

        try {
            await Promise.all(animations.map(({ finished }) => finished));
            return element;
        } finally {
            cleanup(element, data);
        }
    };

    return Promise.all(toNodes(element).map(animateFn));
}

function cleanup(element, data) {
    if (activeAnimations.get(element) === data) {
        activeAnimations.delete(element);
        css(element, 'animationDuration', '');
        removeClass(element, data.classes);
    }
}

function cancel(elements) {
    for (const element of toNodes(elements)) {
        const data = activeAnimations.get(element);

        if (data) {
            for (const animation of data.animations) {
                animation.cancel();
            }
            cleanup(element, data);
        }
    }
}

export const Animation = {
    in: animate,

    out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress(element) {
        return activeAnimations.has(element);
    },

    cancel,
};
