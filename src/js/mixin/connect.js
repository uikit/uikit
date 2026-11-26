import { attr, children, data, hasClass, isTag, queryAll, toArray } from 'uikit-util';
import App from '../api';
import { generateId } from '../api/instance';
import { lazyload } from '../api/observables';
import Togglable from './togglable';

const TogglableComponent = App.extend(Togglable);

export default {
    mixins: [Togglable],

    props: {
        connect: String,
    },

    data: {
        connect: '',
        cls: 'uk-active',
    },

    computed: {
        connectSelector: ({ connect }) => connect,

        connects: {
            get(_, $el) {
                return this.connectSelector ? queryAll(this.connectSelector, $el) : [];
            },
            observe() {
                return this.connectSelector;
            },
        },

        connectChildren() {
            return this.connects.flatMap((el) => children(el));
        },
    },

    watch: {
        connects(connects) {
            for (const el of connects) {
                if (isTag(el, 'ul')) {
                    el.role = 'presentation';
                }
            }
        },
    },

    observe: lazyload({
        targets: ({ connectChildren }) => connectChildren,
        filter: ({ connectSelector }) => connectSelector,
    }),

    update() {
        for (const [index, toggle] of this.toggles.entries()) {
            if (!toggle) {
                continue;
            }

            toggle.id = generateId(this, toggle);

            for (const { children } of this.connects) {
                const item = children[index];

                if (item) {
                    attr(item, {
                        id: generateId(this, item),
                        role: 'tabpanel',
                        'aria-labelledby': toggle.id,
                    });
                }
            }
        }
    },

    methods: {
        getConnectIds(index) {
            return this.connects.map(({ children }) => children[index]?.id).filter(Boolean);
        },

        showConnects(index, animate) {
            const toggle = async (el) => {
                const { children } = el;

                const animation = data(el, 'uk-switcher-animation');

                const togglable = animation
                    ? new TogglableComponent({ data: { ...this.$props, animation } })
                    : this;

                const actives = toArray(children).filter(
                    (child, i) => i !== index && hasClass(child, this.cls),
                );

                if (await togglable.toggleElement(actives, false, animate)) {
                    await togglable.toggleElement(children[index], true, animate);
                }
            };

            return Promise.all(this.connects.map(toggle));
        },
    },
};
