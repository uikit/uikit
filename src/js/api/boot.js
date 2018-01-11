import { getComponentName } from './component';
import { createEvent, doc, docEl, fastdom, hasAttr, Observer } from '../util/index';

export default function (UIkit) {

    var {connect, disconnect} = UIkit;

    if (!Observer) {
        return;
    }

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

    function init() {

        apply(doc.body, connect);

        fastdom.flush();

        (new Observer(mutations => mutations.forEach(applyMutation))).observe(docEl, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        UIkit._initialized = true;
    }

    function applyMutation(mutation) {

        var {target, type} = mutation;

        var update = type !== 'attributes'
            ? applyChildList(mutation)
            : applyAttribute(mutation);

        update && UIkit.update(createEvent('update', true, false, {mutation: true}), target, true);

    }

    function applyAttribute({target, attributeName}) {

        if (attributeName === 'href') {
            return true;
        }

        var name = getComponentName(attributeName);

        if (!name || !(name in UIkit.components)) {
            return;
        }

        if (hasAttr(target, attributeName)) {
            UIkit[name](target);
            return true;
        }

        var component = UIkit.getComponent(target, name);

        if (component) {
            component.$destroy();
            return true;
        }

    }

    function applyChildList({addedNodes, removedNodes}) {

        var i;

        for (i = 0; i < addedNodes.length; i++) {
            apply(addedNodes[i], connect);
        }

        for (i = 0; i < removedNodes.length; i++) {
            apply(removedNodes[i], disconnect);
        }

        return true;
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
