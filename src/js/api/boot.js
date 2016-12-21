import { camelize, matches, Observer, on, ready } from '../util/index';

export default function (UIkit) {

    if (Observer) {

        (new Observer(mutations => {

            var visited = [];

            mutations.forEach(mutation => {

                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    apply(mutation.addedNodes[i], connect, visited);
                }

                for (i = 0; i < mutation.removedNodes.length; i++) {
                    apply(mutation.removedNodes[i], UIkit.disconnect);
                }

            });

        })).observe(document, {childList: true, subtree: true});

    } else {
        ready(() => {
            apply(document.body, connect);
            on(document.body, 'DOMNodeInserted', e => apply(e.target, connect));
            on(document.body, 'DOMNodeRemoved', e => apply(e.target, UIkit.disconnect));
        });
    }

    function connect(node) {

        UIkit.connect(node);

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

    function apply(node, fn, visited = []) {

        var next;

        if (node.nodeType !== Node.ELEMENT_NODE || visited.indexOf(node) !== -1 || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        visited.push(node);
        node = node.firstChild;
        while (node) {
            next = node.nextSibling;
            apply(node, fn, visited);
            node = next;
        }
    }

}
