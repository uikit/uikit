export default function (UIkit) {

    (function (Observer) {

        if (!Observer) {
            return;
        }

        let getComponents = function (node) {

            var components = [],
                name = node.nodeName.toLowerCase().replace(/^uk\-/, '');

            if (UIkit[name]) {
                components.push(name);
            }

            if (node.attributes && node.hasAttribute('is')) {

                node.getAttribute('is').replace(/uk\-/g, '').split(' ').forEach(name => {
                    if (UIkit[name]) {
                        components.push(name)
                    }
                });

            }

            return components;
        };

        let observer = new Observer(mutations => {

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

        });

        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['is']
        });

        // brauchen wir das, wenn wir eh einen Shim dafür benutzen?
    })(window.MutationObserver || window.WebKitMutationObserver);

}
