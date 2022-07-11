import Container from '../mixin/container';
import {
    $,
    append,
    apply,
    closest,
    css,
    parent,
    pointerEnter,
    pointerLeave,
    remove,
    startsWith,
    toFloat,
    Transition,
    trigger,
} from 'uikit-util';

export default {
    mixins: [Container],

    functional: true,

    args: ['message', 'status'],

    data: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        clsContainer: 'uk-notification',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message',
    },

    install,

    computed: {
        marginProp({ pos }) {
            return `margin${startsWith(pos, 'top') ? 'Top' : 'Bottom'}`;
        },

        startProps() {
            return { opacity: 0, [this.marginProp]: -this.$el.offsetHeight };
        },
    },

    created() {
        const container =
            $(`.${this.clsContainer}-${this.pos}`, this.container) ||
            append(
                this.container,
                `<div class="${this.clsContainer} ${this.clsContainer}-${this.pos}" style="display: block"></div>`
            );

        this.$mount(
            append(
                container,
                `<div class="${this.clsMsg}${
                    this.status ? ` ${this.clsMsg}-${this.status}` : ''
                }" role="alert">
                <a href class="${this.clsClose}" data-uk-close></a>
                <div>${this.message}</div>
            </div>`
            )
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
            if (closest(e.target, 'a[href="#"],a[href=""]')) {
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
