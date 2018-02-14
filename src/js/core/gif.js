import {isInView} from '../util/dimensions';

export default function (UIkit) {

    // Deprecated
    UIkit.component('gif', {

        update: {

            read(data) {

                const inview = isInView(this.$el);

                if (!inview || data.isInView === inview) {
                    return false;
                }

                data.isInView = inview;
            },

            write() {
                this.$el.src = this.$el.src;
            },

            events: ['scroll', 'load', 'resize']
        }

    });

}
