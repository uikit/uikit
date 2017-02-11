import { util, container } from 'uikit';

var {$, each, Transition} = util;

var containers = {};

UIkit.component('notification', {

    functional: true,

    args: ['message', 'status'],

    defaults: {
        message: '',
        status: '',
        timeout: 5000,
        duration: 500,
        transition: 'linear',
        group: null,
        pos: 'top-center',
        onClose: null
    },

    created() {

        if (!containers[this.pos]) {
            containers[this.pos] = $(`<div class="uk-notification uk-notification-${this.pos}"></div>`).appendTo(container);
        }

        this.$mount($(
            `<div class="uk-notification-message${this.status ? ` uk-notification-message-${this.status}` : ''}">
                <a href="#" class="uk-notification-close" data-uk-close></a>
                <div>${this.message}</div>
            </div>`
        ).appendTo(containers[this.pos].show()));

    },

    ready() {

        var marginBottom = parseInt(this.$el.css('margin-bottom'), 10);

        Transition.start(
            this.$el.css({opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}),
            {opacity: 1, marginTop: 0, marginBottom: marginBottom}, this.duration, this.transition
        ).then(() => {
            if (this.timeout) {
                this.timer = setTimeout(this.close, this.timeout);
                this.$el
                    .on('mouseenter', () => clearTimeout(this.timer))
                    .on('mouseleave', () => this.timer = setTimeout(this.close, this.timeout));
            }
        });

    },

    events: {

        click(e) {
            e.preventDefault();
            this.close();
        }

    },

    methods: {

        close(immediate) {

            var remove = () => {

                this.onClose && this.onClose();
                this.$el.trigger('close', [this]).remove();

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
                Transition.start(this.$el, {opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}, this.duration, this.transition).then(remove)
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
