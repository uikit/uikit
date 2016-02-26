export default function (UIkit) {

    UIkit.component('close', UIkit.components.icon.extend({

        name: 'close',

        defaults: {icon: 'close', exclude: ['id', 'style', 'class']},

        methods: {

            handleIcon(icon) {
                this.$el.append(icon);
            }

        }

    }));

}
