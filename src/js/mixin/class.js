export default function (UIkit) {

    UIkit.mixin.class = {

        ready() {
            this.$el.addClass(this.$name)
        }

    };

}
