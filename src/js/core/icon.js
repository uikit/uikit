export default function (UIkit) {

    UIkit.component('icon', {

        mixins: [UIkit.mixin.svg],

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class']},

        methods: {

            handle(icon) {
                this.$el.append(icon);
            }

        },

        destroy() {
            this.$el.empty();
        }

    });

}
