export default function (UIkit) {

    (function (Observer) {

        if (!Observer) {
            return;
        }

        var observer = new Observer(mutations => {

            mutations.forEach(mutation => {

                if (mutation.type === 'childList') {

                    for (let i = 0; i < mutation.addedNodes.length; ++i) {

                        let node = mutation.addedNodes[i],
                            component = UIkit[node.nodeName.toLowerCase().replace(/^uk\-/, '')];

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
                            for (let key in node.__uikit__) {
                                node.__uikit__[key].$destroy();
                            }
                        }
                    }

                }

                if (mutation.type === 'attributes') {

                    let node = mutation.target,
                        components = node.getAttribute('is').replace(/uk\-/g, '').split(' ');

                    if (node.__uikit__) {
                        for (let key in node.__uikit__) {
                            if (components.indexOf(key) === -1) {
                                node.__uikit__[key].$destroy();
                            }
                        }
                    }

                    components.forEach(name => {
                        if (UIkit[name]) {
                            UIkit[name](node);
                        }
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
