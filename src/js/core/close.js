export default function (UIkit) {

    UIkit.component('close', UIkit.components.icon.extend({

        defaults: {icon: 'close'},

        methods: {

            handleIcon(icon) {
                this.insert(icon);
            }

        }

    }));

}
