import { apply, hasAttr, inBrowser, startsWith, trigger } from 'uikit-util';
import { components, createComponent, getComponent, getComponents } from './component';
import { callConnected, callDisconnected } from './hooks';

export default function (App) {
    if (inBrowser && window.MutationObserver) {
        if (document.body) {
            requestAnimationFrame(() => init(App));
        } else {
            new MutationObserver((records, observer) => {
                if (document.body) {
                    init(App);
                    observer.disconnect();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }
}

function init(App) {
    trigger(document, 'uikit:init', App);

    if (document.body) {
        apply(document.body, connect);
    }

    new MutationObserver(handleMutation).observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
    });

    App._initialized = true;
}

function handleMutation(records) {
    for (const { addedNodes, removedNodes, target, attributeName } of records) {
        for (const node of addedNodes) {
            apply(node, connect);
        }

        for (const node of removedNodes) {
            apply(node, disconnect);
        }

        const name = attributeName && getComponentName(attributeName);

        if (name) {
            if (hasAttr(target, attributeName)) {
                createComponent(name, target);
            } else {
                getComponent(target, name)?.$destroy();
            }
        }
    }
}

function connect(node) {
    const components = getComponents(node);
    for (const name in components) {
        callConnected(components[name]);
    }

    for (const attributeName of node.getAttributeNames()) {
        const name = getComponentName(attributeName);
        name && createComponent(name, node);
    }
}

function disconnect(node) {
    const components = getComponents(node);
    for (const name in components) {
        callDisconnected(components[name]);
    }
}

function getComponentName(attribute) {
    if (startsWith(attribute, 'data-')) {
        attribute = attribute.slice(5);
    }

    const cmp = components[attribute];
    return cmp && (cmp.options || cmp).name;
}
