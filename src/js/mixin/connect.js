import { children, hasClass, isTag, queryAll, toArray } from 'uikit-util';
import { lazyload } from '../api/observables';
import Togglable from '../mixin/togglable';

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
        connects: {
            get: ({ connect }, $el) => (connect ? queryAll(connect, $el) : []),
            observe: ({ connect }) => connect,
        },

        connectChildren() {
            return this.connects.map((el) => children(el)).flat();
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

    observe: lazyload({ targets: ({ connectChildren }) => connectChildren }),

    methods: {
        showConnects(index, animate) {
            const toggle = async ({ children }) => {
                const actives = toArray(children).filter(
                    (child, i) => i !== index && hasClass(child, this.cls),
                );

                if (await this.toggleElement(actives, false, animate)) {
                    await this.toggleElement(children[index], true, animate);
                }
            };

            return Promise.all(this.connects.map(toggle));
        },
    },
};
