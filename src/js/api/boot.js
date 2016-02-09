import $ from 'jquery';
import {Observer, ready, camelize, hyphenate} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    var selector;

    if (!Observer) {

        ready(() => {
            $(getSelector()).each((i, node) => {
                attachComponents(node);
            });
        });

        return;
    }

    (new Observer(mutations => {

        mutations.forEach(mutation => {

            if (mutation.type === 'childList') {

                for (let i = 0; i < mutation.addedNodes.length; ++i) {

                    let node = mutation.addedNodes[i];

                    if (node.matches && node.matches(getSelector())) {
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

    function getSelector() {

        if (!selector) {
            var components = Object.keys(UIkit.components).map(hyphenate);
            selector = components.length ? '[uk-' + components.join('],[uk-') + ']' : false;
        }

        return selector;
    }

    function attachComponents(node) {

        for (var i = 0; i < node.attributes.length; i++) {

            var name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0) {
                name = camelize(name.replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }
    }

}
