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
                    on(document, 'show hide', (e) => observer.observe(e.target)),
                    on(document, 'shown hidden', (e) => observer.unobserve(e.target)),
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
                    matches(target, this.selActive) ? findTargetColor(target) : '',
                );
            }
        },
    },
};

function findTargetColor(target) {
    const { left, top, height, width } = dimensions(target);

    const elements = target.ownerDocument.elementsFromPoint(
        Math.max(0, left) + width / 2,
        Math.max(0, top) + height / 2,
    );

    for (const element of elements) {
        if (target.contains(element)) {
            continue;
        }

        const color = css(element, '--uk-inverse');
        if (color) {
            return `uk-${color}`;
        }
    }
}
