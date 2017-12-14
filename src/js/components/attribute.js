export default function plugin (UIkit) {

    if (plugin.installed) {
        return;
    }

    const {$, attr} = UIkit.util;

    UIkit.component('attribute', {

        attrs: true,

        props: {
            attribute: String,
            value: String,
            target: String
        },

        defaults: {
            attribute: null,
            value: null,
            target: null
        },

        computed: {
            targetNode() {
                return this.target ? $(this.target) : this.$el.nextElementSibling;
            }
        },

        update: {
            write() {
                if (this.attribute) {
                    console.log('changed');
                    attr(this.targetNode, this.attribute, this.value);
                }
            },

            evens: ['load', 'resize']
        },

        events: {
            change(e) {
                this.value = e.target.value;
                this.$update();
                e.preventDefault();
            },
            click(e) {
                this.value = e.target.value;
                this.$update();
                e.preventDefault();
            }
        }

    });
}