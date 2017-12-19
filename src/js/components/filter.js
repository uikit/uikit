
export default function plugin (UIkit) {

    const { mixin, util } = UIkit;
    const { $ } = util;

    if (plugin.installed) {
        return;
    }

    UIkit.component('filter', {

        mixins: [mixin.filter],

        props: {
            target: String
        },

        defaults: {
            target: null
        },

        computed: {
            targetNode() {
                return this.target ? $(this.target) : this.$el.nextElementSibling;
            }
        },
    });
}