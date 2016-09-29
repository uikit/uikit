import { camelize, matches, Observer, on, ready } from '../util/index';

export default function (UIkit) {

    if (Observer) {

        (new Observer(mutations =>

            mutations.forEach(mutation => {

                for (let i = 0; i < mutation.addedNodes.length; ++i) {
                    apply(mutation.addedNodes[i], attachComponents);
                }

            })

        )).observe(document, {childList: true, subtree: true});

    } else {

        ready(() => {
            apply(document.body, attachComponents);
            on(document.body, 'DOMNodeInserted', e => apply(e.target, attachComponents));
        });

    }

    function attachComponents(node) {

        if (!matches(node, UIkit.component.selector)) {
            return;
        }

        for (var i = 0, name; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0) {
                name = camelize(name.replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }
    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            apply(node, fn);
            node = node.nextSibling;
        }
    }

}
