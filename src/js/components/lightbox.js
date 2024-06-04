import { $, $$, assign, attr, findIndex, isElement, isTag, on, uniqueBy } from 'uikit-util';
import { parseOptions } from '../api/options';
import LightboxPanel from './lightbox-panel';

export default {
    install,

    props: { toggle: String },

    data: { toggle: 'a' },

    computed: {
        toggles: ({ toggle }, $el) => $$(toggle, $el),
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

        delegate: ({ toggle }) => `${toggle}:not(.uk-disabled)`,

        handler(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
                this.show(e.current);
            }
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

    const media = $('img,video', el);
    if (media) {
        item.thumb = media.currentSrc || media.poster || media.src;
    }

    for (const attribute of el.getAttributeNames()) {
        const key = attribute.replace(/^data-/, '');
        item[key === 'href' ? 'source' : key] = el.getAttribute(attribute);
    }

    item.attrs = parseOptions(item.attrs);

    return item;
}
