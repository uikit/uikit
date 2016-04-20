export default function (UIkit) {

    UIkit.component('svg', {

        mixins: [UIkit.mixin.svg],

        ready() {
            this.$el.attr({hidden: true, id: null});
        },

        destroy() {

            this.$el.attr({hidden: null, id: this.id || null});

            if (this.svg) {
                this.svg.remove();
            }
        },

        methods: {

            handle(svg) {
                this.svg = svg.insertAfter(this.$el);
            }

        }

    });

}
