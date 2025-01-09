import {
    $,
    $$,
    assign,
    attr,
    findIndex,
    isElement,
    isTag,
    matches,
    on,
    parents,
    uniqueBy,
} from 'uikit-util';
import { parseOptions } from '../api/options';
import LightboxPanel from './lightbox-panel';

const selDisabled = '.uk-disabled *, .uk-disabled, [disabled]';

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

        delegate: ({ toggle }) => toggle,

        handler(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
                if (!matches(e.current, selDisabled)) {
                    this.show(e.current);
                }
            }
        },
    },

    methods: {
        show(index) {
            let items = this.toggles.map(toItem);

            if (this.nav === 'thumbnav') {
                ensureThumb.call(this, this.toggles, items);
            }

            items = uniqueBy(items, 'source');

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

function ensureThumb(toggles, items) {
    for (const [i, toggle] of Object.entries(toggles)) {
        if (items[i].thumb) {
            continue;
        }

        const parent = parents(toggle)
            .reverse()
            .concat(toggle)
            .find(
                (parent) =>
                    this.$el.contains(parent) &&
                    (parent === toggle || $$(this.toggle, parent).length === 1),
            );

        if (!parent) {
            continue;
        }

        const media = $('img,video', parent);

        if (media) {
            items[i].thumb = media.currentSrc || media.poster || media.src;
            items[i].thumbRatio =
                (media.naturalWidth || media.videoWidth) /
                (media.naturalHeight || media.videoHeight);
        }
    }
}

function toItem(el) {
    const item = {};

    for (const attribute of el.getAttributeNames()) {
        const key = attribute.replace(/^data-/, '');
        item[key === 'href' ? 'source' : key] = el.getAttribute(attribute);
    }

    item.attrs = parseOptions(item.attrs);

    return item;
}
