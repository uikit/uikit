import { camelize, matches, Observer, on, ready } from '../util/index';

export default function (UIkit) {

    if (Observer) {

        (new Observer(function () {

            if (!document.body) {
                return;
            }

            this.disconnect();

            apply(document.body, connect);

            var forEach = Array.prototype.forEach;

            (new Observer(mutations =>
                mutations.forEach(mutation => {
                    forEach.call(mutation.addedNodes, node => apply(node, connect));
                    forEach.call(mutation.removedNodes, node => apply(node, UIkit.disconnect));
                })
            )).observe(document.body, {childList: true, subtree: true});

        })).observe(document.documentElement, {childList: true});

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

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            var next = node.nextSibling;
            apply(node, fn);
            node = next;
        }
    }

}
