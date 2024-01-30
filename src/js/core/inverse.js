import { $$, css, dimensions, matches, observeResize, on, replaceClass } from 'uikit-util';
import { mutation } from '../api/observables';

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
        target: ({ target }, $el) => (target ? $$(target, $el) : [$el]),
    },

    observe: [
        mutation({
            target: ({ target }) => target,
            options: { attributes: true, attributeFilter: ['class'], attributeOldValue: true },
        }),
        {
            target: ({ target }) => target,
            observe: (target, handler) => {
                const observer = observeResize([...target, document.documentElement], handler);
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
            for (const target of this.target) {
                replaceClass(
                    target,
                    'uk-light,uk-dark',
                    !this.selActive || matches(target, this.selActive)
                        ? findTargetColor(target)
                        : '',
                );
            }
        },
    },
};

function findTargetColor(target) {
    const { left, top, height, width } = dimensions(target);

    let last;
    for (const percent of [0.25, 0.5, 0.75]) {
        const elements = target.ownerDocument.elementsFromPoint(
            Math.max(0, left) + width * percent,
            Math.max(0, top) + height / 2,
        );

        for (const element of elements) {
            if (
                target.contains(element) ||
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
