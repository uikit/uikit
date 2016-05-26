export default function (UIkit) {

    UIkit.mixin.class = {

        init() {
            this.$el.addClass(this.$name)
        }

    };

}
