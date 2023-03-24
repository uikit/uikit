import LightboxPanel from './lightbox-panel';
import { parseOptions } from '../api/options';
import { $$, assign, attr, data, findIndex, isElement, isTag, on, uniqueBy } from 'uikit-util';

export default {
    install,

    props: { toggle: String },

    data: { toggle: 'a' },

    computed: {
        toggles({ toggle }, $el) {
            return $$(toggle, $el);
        },
    },

    watch: {
        toggles(toggles) {
            this.hide();
            for (const toggle of toggles) {
                if (isTag(toggle, 'a')) {
                    attr(toggle, 'role', 'button');
                }
            }
        },
    },

    disconnected() {
        this.hide();
    },

    events: {
        name: 'click',

        delegate() {
            return `${this.toggle}:not(.uk-disabled)`;
        },

        handler(e) {
            e.preventDefault();
            this.show(e.current);
        },
    },

    methods: {
        show(index) {
            const items = uniqueBy(this.toggles.map(toItem), 'source');

            if (isElement(index)) {
                const { source } = toItem(index);
                index = findIndex(items, ({ source: src }) => source === src);
            }

            this.panel = this.panel || this.$create('lightboxPanel', { ...this.$props, items });

            on(this.panel.$el, 'hidden', () => (this.panel = null));

            return this.panel.show(index);
        },

        hide() {
            return this.panel?.hide();
        },
    },
};

function install(UIkit, Lightbox) {
    if (!UIkit.lightboxPanel) {
        UIkit.component('lightboxPanel', LightboxPanel);
    }

    assign(Lightbox.props, UIkit.component('lightboxPanel').options.props);
}

function toItem(el) {
    const item = {};

    for (const attr of ['href', 'caption', 'type', 'poster', 'alt', 'attrs']) {
        item[attr === 'href' ? 'source' : attr] = data(el, attr);
    }

    item.attrs = parseOptions(item.attrs);

    return item;
}
