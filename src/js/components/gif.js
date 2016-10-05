import { isInView } from '../util/index';

UIkit.component('gif', {

    update: {

        handler() {

            var inview = isInView(this.$el);

            if (!this.isInView && inview) {
                this.$el[0].src = this.$el[0].src;
            }

            this.isInView = inview;
        },

        events: ['scroll', 'load', 'resize', 'orientationchange']
    }

});
