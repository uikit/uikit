import $ from 'jquery';
import {Observer, ready} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

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

                    let components = mutation.removedNodes[i][DATA];

                    if (components) {
                        for (let name in components) {
                            components[name].$destroy();
                        }
                    }
                }

            }

            if (mutation.type === 'attributes') {

                let components = mutation.target[DATA], current = getComponents(components);

                if (components) {
                    for (let name in components) {
                        if (current.indexOf(name) === -1) {
                            components[name].$destroy();
                        }
                    }
                }

                current.forEach(name => {
                    UIkit[name](components);
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
