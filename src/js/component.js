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
                fn.plugins[plugin].init($this);
            });

            this.init();
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            init: function(){},

            on: function(){
                $(this.element || this).on.apply(this.element || this, arguments);
            },

            off: function(evt){
                $(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                $(this.element || this).trigger(evt, params);
            },

            proxy: function(obj, methods) {

                var $this = this;

                methods.forEach(function(method) {
                    if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
                });
            },

            mixin: function(obj, methods) {

                var $this = this;

                methods.forEach(function(method) {
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