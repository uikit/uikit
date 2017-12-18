export default function plugin (UIkit) {

    if (plugin.installed) {
        return;
    }

    const {$, attr, trigger} = UIkit.util;

    UIkit.component('attribute', {

        attrs: true,

        props: {
            attribute: String,
            event: String,
            value: String,
            target: String
        },

        defaults: {
            attribute: null,
            event: null,
            value: null,
            target: null
        },

        computed: {
            targetNode() {
                return this.target ? $(this.target) : this.$el.nextElementSibling;
            }
        },

        methods: {
            trigger() {
                if (this.event) {
                    trigger(this.targetNode, this.event, this.value);
                }
            }
        },

        update: {
            write() {
                if (this.attribute) {
                    attr(this.targetNode, this.attribute, this.value);
                }
            },

            evens: ['load', 'resize']
        },

        events: {
            change(e) {
                this.value = e.target.value;
                this.$update();
                this.trigger();
                e.preventDefault();
            },
            click(e) {
                this.value = e.target.value;
                this.$update();
                this.trigger();
                e.preventDefault();
            },
            keyup(e) {
                this.value = e.target.value;
                this.$update();
                this.trigger();
                e.preventDefault();
            }
        }

    });
}