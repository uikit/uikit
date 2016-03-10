import {Transition} from '../util/index';

export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [UIkit.mixin.toggle],

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
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

                var deferred;

                if (this.animation === true) {

                    deferred = Transition.start(this.$el, {
                        'overflow': 'hidden',
                        'height': 0,
                        'opacity': 0,
                        'padding-top': 0,
                        'padding-bottom': 0,
                        'margin-top': 0,
                        'margin-bottom': '-' + this.$el.prev().css('margin-bottom')
                    }, this.duration);

                } else {
                    deferred = this.toggleState(this.$el);
                }

                deferred.then(this.$destroy.bind(this));
            }

        },

        destroy() {
            this.$el.off('click');
            this.$el.trigger('closed');
        }

    });

}
