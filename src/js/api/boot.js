import $ from 'jquery';
import {camelize, matches, Observer, ready} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    if (!Observer) {
        ready(() => $(UIkit.component.selector).each((i, node) => attachComponents(node)));
        return;
    }

    (new Observer(mutations => {

        mutations.forEach(mutation => {

            if (mutation.type === 'childList') {

                for (let i = 0; i < mutation.addedNodes.length; ++i) {

                    let node = mutation.addedNodes[i];

                    if (matches(node, UIkit.component.selector)) {
                        attachComponents(node);
                    }
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

        });

    })).observe(document, {childList: true, subtree: true});

    function attachComponents(node) {

        for (var i = 0; i < node.attributes.length; i++) {

            let name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0) {
                name = camelize(name.replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }
    }

}
