(function($, UI) {

    "use strict";

    UI.components = {};

    UI.component = function(name, def) {

        var fn = function(element, options) {

            var $this = this;

            this.element = element ? $(element) : null;
            this.options = $.extend(true, {}, this.defaults, options);

            if (this.element) {
                this.element.data(name, this);
            }

            this.options.plugins.forEach(function(plugin) {
                if(fn.plugins[plugin].init) fn.plugins[plugin].init($this);
            });

            this.init();

            this.options.plugins.forEach(function(plugin) {
                if(fn.plugins[plugin].postinit) fn.plugins[plugin].postinit($this);
            });

            this.trigger('after-init', [this]);
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            init: function(){},

            on: function(){
                return $(this.element || this).on.apply(this.element || this, arguments);
            },

            one: function(){
                return $(this.element || this).one.apply(this.element || this, arguments);
            },

            off: function(evt){
                return $(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                return $(this.element || this).trigger(evt, params);
            },

            find: function(selector) {
                return this.element ? this.element.find(selector) : $([]);
            },

            proxy: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
                });
            },

            mixin: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = obj[method].bind($this);
                });
            },

        }, def);

        this.components[name] = fn;

        this[name] = function() {

            var element, options, object;

            if(arguments.length) {
                switch(arguments.length) {
                    case 1:
                        options = arguments[0];
                        break;
                    case 2:
                        element = $(arguments[0]);
                        options = arguments[1];
                        break;
                }
            }

            if (element && element.data(name)) {
                return element.data(name);
            }

            return (new UI.components[name](element, options));
        };

        return fn;
    };

    UI.plugin = function(component, name, def) {
        this.components[component].plugins[name] = def;
    };

})(jQuery, jQuery.UIkit);