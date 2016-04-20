export default function (UIkit) {

    UIkit.component('slidenav', UIkit.components.icon.extend({

        name: 'slidenav',

        init() {
            this.icon = `slidenav_${this.icon}`;
        }

    }));

}
