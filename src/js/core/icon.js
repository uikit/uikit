export default function (UIkit) {

    UIkit.component('icon', {

        mixins: [UIkit.mixin.svg],

        props: ['icon'],

        defaults: {cls: 'uk-icon'},

        ready() {

            if (!this.icon) {
                return;
            }

            this.class = this.cls;

            this.getIcon(this.$el.css('background-image').slice(4, -1).replace(/"/g, ''), this.icon).then(this.handleIcon);
        },

        methods: {

            handleIcon(icon) {
                this.$el.append(icon);
            }

        },

        destroy() {
            this.$el.empty();
        }

    });

}
