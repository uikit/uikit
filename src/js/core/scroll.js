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
        if (within(e.target, component.$el) && isSameSiteLink(component.$el)) {
            e.preventDefault();
            component.scrollTo(getTargetElement(component.$el));
        }
    }
}

function isSameSiteLink(el) {
    return ['origin', 'pathname', 'search'].every((part) => location[part] === el[part]);
}

export function getTargetElement(el) {
    if (isSameSiteLink(el)) {
        return document.getElementById(decodeURIComponent(el.hash).substring(1));
    }
}
