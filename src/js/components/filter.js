export default function plugin (UIkit) {

    if (plugin.installed) {
        return;
    }

    const {$, toggleClass, toNodes} = UIkit.util;

    UIkit.component('filter', {

        attrs: true,

        props: {
            filter: String,
            target: String
        },

        defaults: {
            filter: null,
            target: null
        },

        ready() {
            // debugger;
        },

        computed: {
            targetNode() {
                return this.target ? $(this.target) : this.$el.nextElementSibling;
            }
        },

        update: {
            write() {
                toNodes(this.targetNode.children).forEach(el => {
                    const show = el.textContent.indexOf(this.filter) >= 0;
                    toggleClass(el, 'uk-hidden', !show);
                });
            },

            evens: ['load', 'resize']
        }

    });
}