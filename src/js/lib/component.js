"use strict";


import 'document-register-element';
import $ from './dom';
import $support from './support';
import $util from './util';


let collection = {};
let components = {};

let registerElement = function(name, def) {

    var webcomponent = $.extend({
        prototype: Object.create(HTMLElement.prototype),
        tag: name
    }, def);

    if (typeof(webcomponent.prototype) == 'string') {
        webcomponent.prototype = Object.create(window[webcomponent.prototype]);
    }

    $util.extend(webcomponent.prototype, {

        createdCallback: function(){
            collection[name](this, $util.attributes(this)).webcomponent.onCreated();
        },
        attachedCallback: function(){
            collection[name](this).webcomponent.onAttached();
        },
        detachedCallback(){
            collection[name](this).webcomponent.onDetached();
        },
        attributeChangedCallback(){
            collection[name](this).webcomponent.onAttributeChanged.apply(this, arguments);
        }
    });

    document.registerElement('uk-'+webcomponent.tag, { prototype: webcomponent.prototype});
};

class Component {

    constructor(element, options) {

        let $this = this;

        this.props = this.props || {};
        this.name  = this.name || false;
        this.uuid  = $util.uuid();

        this.$el   = $(element).data(this.name, this);
        this.$opts = $.extend(true, {}, this.props, options);

        if (this.webcomponent) {
            this.webcomponent = $.extend({
                onCreated(){
                    this.created.apply($this, [$util.attributes($this.$el[0])]);
                },
                onAttached(){
                    this.attached.apply($this, [$util.attributes($this.$el[0])]);
                },
                onDetached(){
                    this.detached.apply($this);
                },
                onAttributeChanged(){
                    this.attributeChanged.apply($this, arguments);
                },
                created(){},
                attached(){
                    $this.init();
                },
                detached(){},
                attributeChanged(){}

            }, this.webcomponent);
        }

        Object.keys(this.props).forEach(prop => {
            $this[prop] = $this.$opts[prop];
        });

        if (!this.webcomponent) {
            this.init();
        }

        if (this.$observe) {

            $this._observer = $.observe(this.$el[0], $util.debounce(function() {
                $this.$observe.apply($this, arguments);
            }, 10));
        }

        this.$trigger('init.uk.component', [this.name, this]);
    }

    $on(a1,a2,a3) {
        return $(this.$el || this).on(a1,a2,a3);
    }

    $one(a1,a2,a3) {
        return $(this.$el || this).one(a1,a2,a3);
    }

    $off(evt) {
        return $(this.$el || this).off(evt);
    }

    $trigger(evt, params) {
        return $(this.$el || this).trigger(evt, params);
    }

    $find(selector) {
        return $(this.$el ? this.$el: []).find(selector);
    }

    $proxy(obj, methods) {

        let $this = this;

        methods.split(' ').forEach(method => {
            if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
        });
    }

    $mixin(obj, methods) {

        let $this = this;

        methods.split(' ').forEach(method => {
            if (!$this[method]) $this[method] = obj[method].bind($this);
        });
    }

    init(){}
}

function register(name, def) {

    let fn = function(element, options) {
        Component.call(this, element, options);
    };

    fn.prototype = Object.create(Component.prototype);
    fn.prototype.constructor = Component;
    fn.prototype.name = name;

    $.extend(true, fn.prototype, def);

    components[name] = fn;
    collection[name] = function(element, options) {

        element = $(element);

        element.each(idx => {
            if (!$(element).data(name)) {
                return (new fn(element, options));
            }
        });

        return element.eq(0).data(name);
    };

    if (def.webcomponent) {
        registerElement(name, def.webcomponent);
    }
};

components.BaseComponent = Component;

exports.components = components;

export default function(container) {

    if (container) {
        collection = container;
    }

    return register;
};
