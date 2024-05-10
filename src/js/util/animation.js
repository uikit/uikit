import { addClass, hasClass, removeClass } from './class';
import { once, trigger } from './event';
import { toNodes } from './lang';
import { css, propName } from './style';

const clsTransition = 'uk-transition';
const transitionEnd = 'transitionend';
const transitionCanceled = 'transitioncanceled';

function transition(element, props, duration = 400, timing = 'linear') {
    duration = Math.round(duration);
    return Promise.all(
        toNodes(element).map(
            (element) =>
                new Promise((resolve, reject) => {
                    for (const name in props) {
                        // Force reflow: transition won't run for previously hidden element
                        css(element, name);
                    }

                    const timer = setTimeout(() => trigger(element, transitionEnd), duration);

                    once(
                        element,
                        [transitionEnd, transitionCanceled],
                        ({ type }) => {
                            clearTimeout(timer);
                            removeClass(element, clsTransition);
                            css(element, {
                                transitionProperty: '',
                                transitionDuration: '',
                                transitionTimingFunction: '',
                            });
                            type === transitionCanceled ? reject() : resolve(element);
                        },
                        { self: true },
                    );

                    addClass(element, clsTransition);
                    css(element, {
                        transitionProperty: Object.keys(props).map(propName).join(','),
                        transitionDuration: `${duration}ms`,
                        transitionTimingFunction: timing,
                        ...props,
                    });
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
const animationEnd = 'animationend';
const animationCanceled = 'animationcanceled';

function animate(element, animation, duration = 200, origin, out) {
    return Promise.all(
        toNodes(element).map(
            (element) =>
                new Promise((resolve, reject) => {
                    if (hasClass(element, clsAnimation)) {
                        trigger(element, animationCanceled);
                    }

                    const classes = [
                        animation,
                        clsAnimation,
                        `${clsAnimation}-${out ? 'leave' : 'enter'}`,
                        origin && `uk-transform-origin-${origin}`,
                        out && `${clsAnimation}-reverse`,
                    ];

                    const timer = setTimeout(() => trigger(element, animationEnd), duration);

                    once(
                        element,
                        [animationEnd, animationCanceled],
                        ({ type }) => {
                            clearTimeout(timer);

                            type === animationCanceled ? reject() : resolve(element);

                            css(element, 'animationDuration', '');
                            removeClass(element, classes);
                        },
                        { self: true },
                    );

                    css(element, 'animationDuration', `${duration}ms`);
                    addClass(element, classes);
                }),
        ),
    );
}

export const Animation = {
    in: animate,

    out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress(element) {
        return hasClass(element, clsAnimation);
    },

    cancel(element) {
        trigger(element, animationCanceled);
    },
};
