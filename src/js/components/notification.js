import {
    $,
    append,
    apply,
    css,
    parent,
    pointerEnter,
    pointerLeave,
    remove,
    toFloat,
    Transition,
    trigger,
} from 'uikit-util';
import Container from '../mixin/container';

export default {
    mixins: [Container],

    functional: true,

    args: ['message', 'status'],

    data: {
        message: '',
        status: '',
        timeout: 5000,
        group: '',
        pos: 'top-center',
        clsContainer: 'uk-notification',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message',
    },

    install,

    computed: {
        marginProp: ({ pos }) => `margin-${pos.match(/[a-z]+(?=-)/)[0]}`,

        startProps() {
            return { opacity: 0, [this.marginProp]: -this.$el.offsetHeight };
        },
    },

    created() {
        const posClass = `${this.clsContainer}-${this.pos}`;
        const containerAttr = `data-${this.clsContainer}-container`;
        const container =
            $(`.${posClass}[${containerAttr}]`, this.container) ||
            append(
                this.container,
                `<div class="${this.clsContainer} ${posClass}" ${containerAttr}></div>`,
            );

        this.$mount(
            append(
                container,
                `<div class="${this.clsMsg}${
                    this.status ? ` ${this.clsMsg}-${this.status}` : ''
                }" role="alert">
                    <a href class="${this.clsClose}" data-uk-close></a>
                    <div>${this.message}</div>
                </div>`,
            ),
        );
    },

    async connected() {
        const margin = toFloat(css(this.$el, this.marginProp));
        await Transition.start(css(this.$el, this.startProps), {
            opacity: 1,
            [this.marginProp]: margin,
        });

        if (this.timeout) {
            this.timer = setTimeout(this.close, this.timeout);
        }
    },

    events: {
        click(e) {
            if (e.target.closest('a[href="#"],a[href=""]')) {
                e.preventDefault();
            }
            this.close();
        },

        [pointerEnter]() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        },

        [pointerLeave]() {
            if (this.timeout) {
                this.timer = setTimeout(this.close, this.timeout);
            }
        },
    },

    methods: {
        async close(immediate) {
            const removeFn = (el) => {
                const container = parent(el);

                trigger(el, 'close', [this]);
                remove(el);

                if (!container?.hasChildNodes()) {
                    remove(container);
                }
            };

            if (this.timer) {
                clearTimeout(this.timer);
            }

            if (!immediate) {
                await Transition.start(this.$el, this.startProps);
            }

            removeFn(this.$el);
        },
    },
};

function install(UIkit) {
    UIkit.notification.closeAll = function (group, immediate) {
        apply(document.body, (el) => {
            const notification = UIkit.getComponent(el, 'notification');
            if (notification && (!group || group === notification.group)) {
                notification.close(immediate);
            }
        });
    };
}
