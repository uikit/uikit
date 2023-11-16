import {
    $,
    getTargetedElement,
    isSameSiteAnchor,
    off,
    on,
    scrollIntoView,
    trigger,
} from 'uikit-util';

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

const instances = new Set();
function registerClick(cmp) {
    if (!instances.size) {
        on(document, 'click', clickHandler);
    }

    instances.add(cmp);
}

function unregisterClick(cmp) {
    instances.delete(cmp);

    if (!instances.size) {
        off(document, 'click', clickHandler);
    }
}

function clickHandler(e) {
    if (e.defaultPrevented) {
        return;
    }

    for (const instance of instances) {
        if (instance.$el.contains(e.target) && isSameSiteAnchor(instance.$el)) {
            e.preventDefault();
            if (window.location.href !== instance.$el.href) {
                window.history.pushState({}, '', instance.$el.href);
            }
            instance.scrollTo(getTargetedElement(instance.$el));
        }
    }
}
