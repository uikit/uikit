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

            })).observe(document.documentElement, {childList: true, subtree: true});

        }

    } else {

        ready(() => {
            apply(document.body, UIkit.connect);
            on(document.documentElement, 'DOMNodeInserted', e => apply(e.target, UIkit.connect));
            on(document.documentElement, 'DOMNodeRemoved', e => apply(e.target, UIkit.disconnect));
        });

    }

    function init() {

        apply(document.body, UIkit.connect);

        (new Observer(mutations =>
            mutations.forEach(({addedNodes, removedNodes, target}) => {

                for (var i = 0; i < addedNodes.length; i++) {
                    apply(addedNodes[i], UIkit.connect)
                }

                for (i = 0; i < removedNodes.length; i++) {
                    apply(removedNodes[i], UIkit.disconnect)
                }

                UIkit.update('update', target, true);

            })
        )).observe(document.documentElement, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href']});

        UIkit._initialized = true;
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
