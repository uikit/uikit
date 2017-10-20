import { isInView } from '../util/index';

export default function (UIkit) {

    UIkit.component('gif', {

        update: {

            read() {

                var inview = isInView(this.$el);

                if (!this.isInView && inview) {
                    this.$el.src = this.$el.src;
                }

                this.isInView = inview;
            },

            events: ['scroll', 'load', 'resize']
        }

    });

}
