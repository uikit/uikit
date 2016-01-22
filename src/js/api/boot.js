export default function (UIkit) {

    (function (Observer) {

        if (!Observer) {
            return;
        }

        var observer = new Observer(mutations => {

            mutations.forEach(mutation => {

                for (let i = 0; i < mutation.addedNodes.length; ++i) {

                    let node = mutation.addedNodes[i];
                    let component = UIkit[node.nodeName.toLowerCase().replace(/^uk\-/, '')];

                    if (component) {
                        component(node);
                    }

                    if (node.attributes && node.hasAttribute('is')) {

                        node.getAttribute('is').replace(/uk\-/g, '').split(' ').forEach(name => {
                            if (UIkit[name]) {
                                UIkit[name](node);
                            }
                        });

                    }

                }

                for (let i = 0; i < mutation.removedNodes.length; ++i) {
                    let node = mutation.removedNodes[i];

                    if (node.__uikit__) {
                        node.__uikit__.forEach(component => {
                            component.$destroy();
                        });
                    }
                }

            });

        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // brauchen wir das, wenn wir eh einen Shim dafür benutzen?
    })(window.MutationObserver || window.WebKitMutationObserver);

}
