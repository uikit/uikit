function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {append, closest, css, each, pointerEnter, pointerLeave, remove, toFloat, Transition, trigger} = UIkit.util;
    const containers = {};

    UIkit.component('notification', {

        functional: true,

        args: ['message', 'status'],

        defaults: {
            message: '',
            status: '',
            timeout: 5000,
            group: null,
            pos: 'top-center',
            clsClose: 'uk-notification-close',
            clsMsg: 'uk-notification-message'
        },

        created() {

            if (!containers[this.pos]) {
                containers[this.pos] = append(UIkit.container, `<div class="uk-notification uk-notification-${this.pos}"></div>`);
            }

            const container = css(containers[this.pos], 'display', 'block');

            this.$mount(append(container,
                `<div class="${this.clsMsg}${this.status ? ` ${this.clsMsg}-${this.status}` : ''}">
                    <a href="#" class="${this.clsClose}" data-uk-close></a>
                    <div>${this.message}</div>
                </div>`
            ));

        },

        ready() {

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

    });

    UIkit.notification.closeAll = function (group, immediate) {
        each(UIkit.instances, component => {
            if (component.$options.name === 'notification' && (!group || group === component.group)) {
                component.close(immediate);
            }
        });
    };

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
