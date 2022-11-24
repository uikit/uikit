import { $, off, on, scrollIntoView, trigger, within } from 'uikit-util';

export default {
    props: {
        offset: Number,
    },

    data: {
        offset: 0,
    },

    connected() {
        registerClick(this);
    },

    disconnected() {
        unregisterClick(this);
    },

    methods: {
        async scrollTo(el) {
            el = (el && $(el)) || document.body;

            if (trigger(this.$el, 'beforescroll', [this, el])) {
                await scrollIntoView(el, { offset: this.offset });
                trigger(this.$el, 'scrolled', [this, el]);
            }
        },
    },
};

const components = new Set();
function registerClick(cmp) {
    if (!components.size) {
        on(document, 'click', clickHandler);
    }

    components.add(cmp);
}

function unregisterClick(cmp) {
    components.delete(cmp);

    if (!components.size) {
        off(document, 'click', clickHandler);
    }
}

function clickHandler(e) {
    if (e.defaultPrevented) {
        return;
    }

    for (const component of components) {
        if (within(e.target, component.$el)) {
            const targetElement = getTargetElement(component.$el);
            if (targetElement) {
                e.preventDefault();
                component.scrollTo(targetElement);
            }
        }
    }
}

export function getTargetElement(el) {
    for (const part of ['origin', 'pathname', 'search']) {
        if (location[part] !== el[part]) {
            return;
        }
    }

    return document.getElementById(decodeURIComponent(el.hash).substring(1));
}
