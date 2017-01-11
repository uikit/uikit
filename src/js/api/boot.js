import { Observer, on, ready } from '../util/index';

export default function (UIkit) {

    if (Observer) {

        if (document.body) {

            init();

        } else {

            (new Observer(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(document.documentElement, {childList: true});

        }

    } else {

        ready(() => {
            apply(document.body, connect);
            on(document.body, 'DOMNodeInserted', e => apply(e.target, UIkit.connect));
            on(document.body, 'DOMNodeRemoved', e => apply(e.target, UIkit.disconnect));
        });

    }

    function init() {

        var forEach = Array.prototype.forEach;

        apply(document.body, UIkit.connect);

        (new Observer(mutations =>
            mutations.forEach(mutation => {
                forEach.call(mutation.addedNodes, node => apply(node, UIkit.connect));
                forEach.call(mutation.removedNodes, node => apply(node, UIkit.disconnect));
            })
        )).observe(document.body, {childList: true, subtree: true});

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
