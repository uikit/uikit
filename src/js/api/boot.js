import { callConnected, callDisconnected } from './hooks';
import { components, createComponent, getComponent, getComponents } from './component';
import { apply, hasAttr, inBrowser, isPlainObject, startsWith, trigger } from 'uikit-util';

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

    new MutationObserver((records) => records.forEach(applyChildListMutation)).observe(document, {
        childList: true,
        subtree: true,
    });

    new MutationObserver((records) => records.forEach(applyAttributeMutation)).observe(document, {
        attributes: true,
        subtree: true,
    });

    App._initialized = true;
}

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
            createComponent(name, target);
            return;
        }

        getComponent(target, name)?.$destroy();
    }
}

function connect(node) {
    const components = getComponents(node);
    for (const name in getComponents(node)) {
        callConnected(components[name]);
    }

    for (const attributeName of node.getAttributeNames()) {
        const name = getComponentName(attributeName);
        name && createComponent(name, node);
    }
}

function disconnect(node) {
    const components = getComponents(node);
    for (const name in getComponents(node)) {
        callDisconnected(components[name]);
    }
}

function getComponentName(attribute) {
    if (startsWith(attribute, 'data-')) {
        attribute = attribute.slice(5);
    }

    const cmp = components[attribute];
    return cmp && (isPlainObject(cmp) ? cmp : cmp.options).name;
}
