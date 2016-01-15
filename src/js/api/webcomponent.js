import $ from 'jquery';
import 'document-register-element';
import {extend, attributes} from '../util/index';


function registerElement(name, def) {

    def = extend({
        prototype: Object.create(HTMLElement.prototype)
    }, def);

    if (typeof(def.prototype) == 'string') {
        def.prototype = Object.create(window[def.prototype]);
    }

    extend(true, def.prototype, {

        createdCallback: function(){
            let component = UIkit[name](this, attributes(this));
            component.$created.apply(component, arguments);
        },
        attachedCallback: function(){
            let component = UIkit[name](this);
            component.$attached.apply(component, arguments);

        },
        detachedCallback(){
            let component = UIkit[name](this);
            component.$detached.apply(component, arguments);
        },
        attributeChangedCallback(){
            let component = UIkit[name](this);
            component.onAttributeChanged.apply(component, arguments);
        }
    });

    let opts = { prototype: def.prototype};

    opts.prototype.ukcomponent = true;

    if (def.extends) {
        opts.extends = def.extends;
    }

    document.registerElement('uk-'+name, opts);
};

// support <element is="uk-*"></element>
(function(MO) {

    if (!MO) return;

    function init(nodes) {

        for (let i = 0, length = nodes.length, node, name, init, obj; i < length;i++) {

            node = nodes[i];
            name = (node.getAttribute && node.getAttribute('is') || '').replace(/uk\-/g, '');

            name.split(' ').forEach(component => {

                component = component.trim();

                if (component && UIkit.components[component] && !node['$'+component]) {

                    obj = UIkit[component](node, attributes(node));

                    obj.$created();
                    obj.$attached();
                }
            });
        }
    }

    return new MO(function(records) {

        for (let current, node, newValue, i = 0, length = records.length; i < length; i++) {
            current = records[i];
            if (current.type === 'childList') {
                init(current.addedNodes, 'created attached');
            }
        }
    });

})(window.MutationObserver || window.WebKitMutationObserver).observe(document, {
    childList: true,
    subtree: true
});


export default function(UIkit) {

    let Component = UIkit.components.base.extend({

    });

    UIkit.components.webcomponent = Component;

    UIkit.webcomponent = function(name, def) {

        registerElement(name, def.webcomponent || {});

        def.methods = extend({
            $created(){},
            $attached(){},
            $detached(){},
            $attributeChanged(){}
        }, def.methods);

        return UIkit.component(name, def);
    }
}
