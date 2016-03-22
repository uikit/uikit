export default function (UIkit) {

    UIkit.component('nav', UIkit.components.accordion.extend({
        defaults: {
            targets: '> .uk-parent',
            toggle: '> a',
            content: '> ul',
            collapsible: true,
            multiple: true
        }
    }));

}
