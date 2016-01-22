import $ from 'jquery';
import {Observer, ready} from '../util/index';

export default function (UIkit) {

    if (!Observer) {

        ready(() => {
            $('[is^="uk-"]').each((i, node) => {
                getComponents(node).forEach(component => {
                    UIkit[component](node);
                });
            });
        });

        return;
    }

    (new Observer(mutations => {

        mutations.forEach(mutation => {

            if (mutation.type === 'childList') {

                for (let i = 0; i < mutation.addedNodes.length; ++i) {

                    let node = mutation.addedNodes[i];

                    getComponents(node).forEach(component => {
                        UIkit[component](node);
                    })
                }

                for (let i = 0; i < mutation.removedNodes.length; ++i) {

                    let node = mutation.removedNodes[i];

                    if (node.__uikit__) {
                        for (let key in node.__uikit__) {
                            node.__uikit__[key].$destroy();
                        }
                    }
                }

            }

            if (mutation.type === 'attributes') {

                let node = mutation.target, components = getComponents(node);

                if (node.__uikit__) {
                    for (let key in node.__uikit__) {
                        if (components.indexOf(key) === -1) {
                            node.__uikit__[key].$destroy();
                        }
                    }
                }

                components.forEach(name => {
                    UIkit[name](node);
                });

            }

        });

    })).observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['is']
    });

}

function getComponents(node) {

    var components = [];

    if (node.attributes && node.hasAttribute('is')) {

        node.getAttribute('is').replace(/uk\-/g, '').split(' ').forEach(name => {
            if (UIkit[name]) {
                components.push(name)
            }
        });

    }

    return components;
}
