(function(addon) {

    var component;

    if (jQuery && UIkit) {
        component = addon(jQuery, UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideset", ["uikit"], function(){
            return component || addon(jQuery, UIkit);
        });
    }

})(function($, UI){

    "use strict";

    UI.component('slideset', {

        defaults: {
            automute : true
        },

        boot: function() {

            // auto init
            UI.ready(function(context) {

                UI.$("[data-@-slideset]", context).each(function(){

                    var ele = UI.$(this);

                    if(!ele.data("slideset")) {
                        var plugin = UI.slideset(ele, UI.Utils.options(ele.attr("data-@-slideset")));
                    }
                });
            });
        },

        init: function() {

            
        }
    });

});
