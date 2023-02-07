import { $, off, on, scrollIntoView, trigger, within } from 'uikit-util';
import { isSameSiteAnchor } from '../mixin/modal';

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
        if (within(e.target, component.$el) && isSameSiteAnchor(component.$el)) {
            e.preventDefault();
            component.scrollTo(getTargetElement(component.$el));
        }
    }
}

export function getTargetElement(el) {
    if (isSameSiteAnchor(el)) {
        const id = decodeURIComponent(el.hash).substring(1);
        return document.getElementById(id) || document.getElementsByName(id)[0];
    }
}
