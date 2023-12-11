import {
    $$,
    css,
    dimensions,
    matches,
    observeResize,
    on,
    replaceClass,
    scrollParent,
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
        target: ({ target }, $el) => (target ? $$(target, $el) : [$el]),
    },

    disconnect() {
        this._listener?.();
    },

    observe: [
        mutation({
            target: ({ target }) => target,
            handler: 'register',
            options: { attributes: true, attributeFilter: ['class'], attributeOldValue: true },
        }),
        intersection({
            handler([{ isIntersecting }]) {
                this._isIntersecting = isIntersecting;
                this.register();
            },
            options: { rootMargin: '500px 0px' },
            args: { intersecting: false },
        }),
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
        events: ['color'],
    },

    methods: {
        register() {
            const active = this._isIntersecting;

            if (!active) {
                if (this._listener) {
                    this._listener();
                    delete this._listener;
                }

                return;
            }

            this._listener ||= registerListener(this.target, () => this.$emit('color'));
        },
    },
};

function registerListener(targets, handler) {
    const parent = scrollParent(targets, true);
    const scrollEl = parent === document.documentElement ? document : parent;

    const observer = observeResize([...targets, parent], handler);
    const listener = [
        on(scrollEl, 'scroll', handler, { passive: true }),
        on(document, 'itemshown itemhidden', handler),
        on(document, 'show hide', (e) => observer.observe(e.target)),
        on(document, 'shown hidden', (e) => observer.unobserve(e.target)),
    ];

    return () => {
        listener.map((off) => off());
        observer.disconnect();
    };
}

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
