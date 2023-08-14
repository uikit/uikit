import {
    $,
    css,
    getTargetedElement,
    isSameSiteAnchor,
    off,
    on,
    scrollIntoView,
    toPx,
    trigger,
    within,
} from 'uikit-util';

export default {
    props: {
        offset: null,
    },

    data: {
        offset: false,
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
                const offset = toPx(
                    this.offset === false ? css(this.$el, '--uk-scroll-offset') : this.offset,
                );
                await scrollIntoView(el, { offset });
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
        if (within(e.target, instance.$el) && isSameSiteAnchor(instance.$el)) {
            e.preventDefault();
            if (window.location.href !== instance.$el.href) {
                window.history.pushState({}, '', instance.$el.href);
            }
            instance.scrollTo(getTargetedElement(instance.$el));
        }
    }
}
