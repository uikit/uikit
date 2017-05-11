import { fastdom, Observer, on, ready } from '../util/index';

export default function (UIkit) {

    var doc = document.documentElement, {connect, disconnect} = UIkit;

    if (Observer) {

        if (document.body) {

            init();

        } else {

            (new Observer(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(doc, {childList: true, subtree: true});

        }

    } else {

        ready(() => {
            apply(document.body, connect);
            on(doc, 'DOMNodeInserted', e => apply(e.target, connect));
            on(doc, 'DOMNodeRemoved', e => apply(e.target, disconnect));
        });

    }

    function init() {

        apply(document.body, connect);

        fastdom.flush();

        (new Observer(mutations =>
            mutations.forEach(({addedNodes, removedNodes, target}) => {

                for (var i = 0; i < addedNodes.length; i++) {
                    apply(addedNodes[i], connect)
                }

                for (i = 0; i < removedNodes.length; i++) {
                    apply(removedNodes[i], disconnect)
                }

                UIkit.update('update', target, true);

            })
        )).observe(doc, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href']});

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
