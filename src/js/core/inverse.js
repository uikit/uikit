import {
    $$,
    css,
    dimensions,
    intersectRect,
    matches,
    observeResize,
    on,
    parent,
    replaceClass,
    toNodes,
} from 'uikit-util';
import { intersection, mutation } from '../api/observables';

export default {
    props: {
        target: String,
        selActive: String,
    },

    data: {
        target: false,
        selActive: false,
    },

    computed: {
        target: ({ target }, $el) => (target ? $$(target, $el) : $el),
    },

    observe: [
        intersection({
            handler(entries) {
                this.isIntersecting = entries.some(({ isIntersecting }) => isIntersecting);
                this.$emit();
            },
            target: ({ target }) => target,
            args: { intersecting: false },
        }),
        mutation({
            target: ({ target }) => target,
            options: { attributes: true, attributeFilter: ['class'], attributeOldValue: true },
        }),
        {
            target: ({ target }) => target,
            observe: (target, handler) => {
                const observer = observeResize(
                    [...toNodes(target), document.documentElement],
                    handler,
                );
                const listener = [
                    on(document, 'scroll itemshown itemhidden', handler, {
                        passive: true,
                        capture: true,
                    }),
                    on(document, 'show hide transitionstart', (e) => {
                        handler();
                        return observer.observe(e.target);
                    }),
                    on(document, 'shown hidden transitionend transitioncancel', (e) => {
                        handler();
                        return observer.unobserve(e.target);
                    }),
                ];

                return {
                    observe: observer.observe.bind(observer),
                    unobserve: observer.unobserve.bind(observer),
                    disconnect() {
                        observer.disconnect();
                        listener.map((off) => off());
                    },
                };
            },
            handler() {
                this.$emit();
            },
        },
    ],

    update: {
        read() {
            if (!this.isIntersecting) {
                return false;
            }

            for (const target of toNodes(this.target)) {
                let color =
                    !this.selActive || matches(target, this.selActive)
                        ? findTargetColor(target)
                        : '';

                if (color !== false) {
                    replaceClass(target, 'uk-light uk-dark', color);
                }
            }
        },
    },
};

function findTargetColor(target) {
    const dim = dimensions(target);
    const viewport = dimensions(window);

    if (!intersectRect(dim, viewport)) {
        return false;
    }

    const { left, top, height, width } = dim;

    let last;
    for (const percent of [0.25, 0.5, 0.75]) {
        const elements = target.ownerDocument.elementsFromPoint(
            Math.max(0, Math.min(left + width * percent, viewport.width - 1)),
            Math.max(0, Math.min(top + height / 2, viewport.height - 1)),
        );

        for (const element of elements) {
            if (
                target.contains(element) ||
                !checkVisibility(element) ||
                (element.closest('[class*="-leave"]') &&
                    elements.some((el) => element !== el && matches(el, '[class*="-enter"]')))
            ) {
                continue;
            }

            const color = css(element, '--uk-inverse');
            if (color) {
                if (color === last) {
                    return `uk-${color}`;
                }

                last = color;
                break;
            }
        }
    }

    return last ? `uk-${last}` : '';
}

// TODO: once it becomes Baseline `element.checkVisibility({ opacityProperty: true, visibilityProperty: true })`
function checkVisibility(element) {
    if (css(element, 'visibility') !== 'visible') {
        return false;
    }

    while (element) {
        if (css(element, 'opacity') === '0') {
            return false;
        }
        element = parent(element);
    }

    return true;
}
