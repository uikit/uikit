import {Animation} from '../util/index';

export default function (UIkit) {

    UIkit.component('alert', {

        props: {
            animation: null,
            duration: Number,
            close: String
        },

        defaults: {
            animation: true,
            duration: 200,
            close: '.uk-alert-close'
        },

        ready() {
            this.$el.on('click', this.close, e => {
                e.preventDefault();
                this.closeAlert();
            });
        },

        methods: {

            closeAlert() {

                this.$el.trigger('close');

                if (String(this.animation) === 'true') {

                    Animation.transition(this.$el, {
                        'overflow': 'hidden',
                        'height': 0,
                        'opacity': 0,
                        'padding-top': 0,
                        'padding-bottom': 0,
                        'margin-top': 0,
                        'margin-bottom': 0
                    }, this.duration).then(this.$destroy.bind(this));

                } else if (typeof this.animation === 'string' && this.animation !== 'false') {

                    Animation.out(this.$el, this.animation, this.duration).then(this.$destroy.bind(this));

                } else {
                    this.$destroy();
                }

            }

        },

        destroy() {
            this.$el.off('click');
            this.$el.trigger('closed');
        }

    });

}
