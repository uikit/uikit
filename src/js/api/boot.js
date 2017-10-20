import { createEvent, doc, docEl, fastdom, hasAttr, Observer, on, ready } from '../util/index';

export default function (UIkit) {

    var {connect, disconnect} = UIkit;

    if (Observer) {

        if (doc.body) {

            init();

        } else {

            (new Observer(function () {

                if (doc.body) {
                    this.disconnect();
                    init();
                }

            })).observe(docEl, {childList: true, subtree: true});

        }

    } else {

        ready(() => {
            apply(doc.body, connect);
            on(docEl, 'DOMNodeInserted', e => apply(e.target, connect));
            on(docEl, 'DOMNodeRemoved', e => apply(e.target, disconnect));
        });

    }

    function init() {

        apply(doc.body, connect);

        fastdom.flush();

        (new Observer(mutations =>
            mutations.forEach(({addedNodes, removedNodes, target}) => {

                for (var i = 0; i < addedNodes.length; i++) {
                    apply(addedNodes[i], connect)
                }

                for (i = 0; i < removedNodes.length; i++) {
                    apply(removedNodes[i], disconnect)
                }

                UIkit.update(createEvent('update', true, false, {mutation: true}), target, true);

            })
        )).observe(docEl, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['href']
        });

        UIkit._initialized = true;
    }

    function apply(node, fn) {

        if (node.nodeType !== 1 || hasAttr(node, 'uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstElementChild;
        while (node) {
            var next = node.nextElementSibling;
            apply(node, fn);
            node = next;
        }
    }

}
