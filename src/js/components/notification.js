function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, each, pointerEnter, pointerLeave, toFloat, Transition, trigger} = UIkit.util;
    var containers = {};

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
                containers[this.pos] = $(`<div class="uk-notification uk-notification-${this.pos}"></div>`).appendTo(UIkit.container);
            }

            this.$mount($(
                `<div class="${this.clsMsg}${this.status ? ` ${this.clsMsg}-${this.status}` : ''}">
                    <a href="#" class="${this.clsClose}" data-uk-close></a>
                    <div>${this.message}</div>
                </div>`
            ).appendTo(containers[this.pos].show())[0]);

        },

        ready() {

            var marginBottom = toFloat(this.$el.css('marginBottom'));

            Transition.start(
                this.$el.css({opacity: 0, marginTop: -1 * this.$el[0].offsetHeight, marginBottom: 0}),
                {opacity: 1, marginTop: 0, marginBottom}
            ).then(() => {
                if (this.timeout) {
                    this.timer = setTimeout(this.close, this.timeout);
                }
            });

        },

        events: {

            click(e) {
                if ($(e.target).closest('a[href="#"]').length) {
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

                var remove = () => {

                    trigger(this.$el, 'close', [this]);
                    this.$el.remove();

                    if (!containers[this.pos].children().length) {
                        containers[this.pos].hide();
                    }

                };

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                if (immediate) {
                    remove();
                } else {
                    Transition.start(this.$el, {
                        opacity: 0,
                        marginTop: -1 * this.$el[0].offsetHeight,
                        marginBottom: 0
                    }).then(remove)
                }
            }

        }

    });

    UIkit.notification.closeAll = function (group, immediate) {
        each(UIkit.instances, (_, component) => {
            if (component.$options.name === 'notification' && (!group || group === component.group)) {
                component.close(immediate);
            }
        })
    };

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
