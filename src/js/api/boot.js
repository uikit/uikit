import { getComponentName } from './component';
import { apply, hasAttr, inBrowser, trigger } from 'uikit-util';

export default function (UIkit) {
    const { connect, disconnect } = UIkit;

    if (!inBrowser || !window.MutationObserver) {
        return;
    }

    requestAnimationFrame(function () {
        trigger(document, 'uikit:init', UIkit);

        if (document.body) {
            apply(document.body, connect);
        }

        new MutationObserver((records) => records.forEach(applyChildListMutation)).observe(
            document,
            {
                childList: true,
                subtree: true,
            }
        );

        new MutationObserver((records) => records.forEach(applyAttributeMutation)).observe(
            document,
            {
                attributes: true,
                subtree: true,
            }
        );

        UIkit._initialized = true;
    });

    function applyChildListMutation({ addedNodes, removedNodes }) {
        for (const node of addedNodes) {
            apply(node, connect);
        }

        for (const node of removedNodes) {
            apply(node, disconnect);
        }
    }

    function applyAttributeMutation({ target, attributeName }) {
        const name = getComponentName(attributeName);

        if (name) {
            if (hasAttr(target, attributeName)) {
                UIkit[name](target);
                return;
            }

            UIkit.getComponent(target, name)?.$destroy();
        }
    }
}
