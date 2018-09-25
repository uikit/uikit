import {append, apply, closest, css, pointerEnter, pointerLeave, remove, toFloat, Transition, trigger} from 'uikit-util';

const containers = {};

export default {

    functional: true,

    args: ['message', 'status'],

    data: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message'
    },

    install,

    created() {

        if (!containers[this.pos]) {
            containers[this.pos] = append(this.$container, `<div class="uk-notification uk-notification-${this.pos}"></div>`);
        }

        const container = css(containers[this.pos], 'display', 'block');

        this.$mount(append(container,
            `<div class="${this.clsMsg}${this.status ? ` ${this.clsMsg}-${this.status}` : ''}">
                    <a href="#" class="${this.clsClose}" data-uk-close></a>
                    <div>${this.message}</div>
                </div>`
        ));

    },

    connected() {

        const marginBottom = toFloat(css(this.$el, 'marginBottom'));
        Transition.start(
            css(this.$el, {opacity: 0, marginTop: -this.$el.offsetHeight, marginBottom: 0}),
            {opacity: 1, marginTop: 0, marginBottom}
        ).then(() => {
            if (this.timeout) {
                this.timer = setTimeout(this.close, this.timeout);
            }
        });

    },

    events: {

        click(e) {
            if (closest(e.target, 'a[href="#"]')) {
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
        }

    },

    methods: {

        close(immediate) {

            const removeFn = () => {

                trigger(this.$el, 'close', [this]);
                remove(this.$el);

                if (!containers[this.pos].children.length) {
                    css(containers[this.pos], 'display', 'none');
                }

            };

            if (this.timer) {
                clearTimeout(this.timer);
            }

            if (immediate) {
                removeFn();
            } else {
                Transition.start(this.$el, {
                    opacity: 0,
                    marginTop: -this.$el.offsetHeight,
                    marginBottom: 0
                }).then(removeFn);
            }
        }

    }

};

function install(UIkit) {
    UIkit.notification.closeAll = function (group, immediate) {
        apply(document.body, el => {
            const notification = UIkit.getComponent(el, 'notification');
            if (notification && (!group || group === notification.group)) {
                notification.close(immediate);
            }
        });
    };
}
