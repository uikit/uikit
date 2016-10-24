/*! UIkit 2.27.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-form-select', ['uikit'], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    "use strict";

    UI.component('formSelect', {

        defaults: {
            target: '>span:first',
            activeClass: 'uk-active'
        },

        boot: function() {
            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-form-select]', context).each(function(){

                    var ele = UI.$(this);

                    if (!ele.data('formSelect')) {
                        UI.formSelect(ele, UI.Utils.options(ele.attr('data-uk-form-select')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.target  = this.find(this.options.target);
            this.select  = this.find('select');

            // init + on change event
            this.select.on({

                change: (function(){

                    var select = $this.select[0], fn = function(){

                        try {

                            if($this.options.target === 'input') {
                                $this.target.val(select.options[select.selectedIndex].text);
                            } else {
                                $this.target.text(select.options[select.selectedIndex].text);
                            }

                        } catch(e) {}

                        $this.element[$this.select.val() ? 'addClass':'removeClass']($this.options.activeClass);

                        return fn;
                    };

                    return fn();
                })(),

                focus: function(){ $this.target.addClass('uk-focus') },
                blur: function(){ $this.target.removeClass('uk-focus') },
                mouseenter: function(){ $this.target.addClass('uk-hover') },
                mouseleave: function(){ $this.target.removeClass('uk-hover') }
            });

            this.element.data("formSelect", this);
        }
    });

    return UI.formSelect;
});
