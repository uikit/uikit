/*! UIkit 2.12.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-cover", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    "use strict";

    UI.component('cover', {

        defaults: {
            automute : true
        },

        init: function() {

            this.parent    = this.element.parent();
            this.dimension = {w: this.element.width(), h: this.element.height()};
            this.ratio     = this.dimension.w / this.dimension.h;

            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(){
                this.check();
            }.bind(this), 100));

            this.check();

            this.element.data("cover", this);


            if (this.element.is('iframe') && this.options.automute) {

                var src = this.element.attr('src');

                this.element.attr('src', '').on('load', function(){

                    this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');

                }).attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1'].join(''));
            }
        },

        check: function() {

            var w = this.parent.width(), h = this.parent.height(), width, height;

            // if element height < parent height (gap underneath)
            if ((w / this.ratio) < h) {

                width  = Math.ceil(h * this.ratio);
                height = h;

            // element width < parent width (gap to right)
            } else {

                width  = w;
                height = Math.ceil(w / this.ratio);
            }

            this.element.css({
                'width'  : width,
                'height' : height
            });
        }
    });

    // auto init
    UI.ready(function(context) {

        $("[data-uk-cover]", context).each(function(){

            var ele = $(this);

            if(!ele.data("cover")) {
                var plugin = UI.cover(ele, UI.Utils.options(ele.attr("data-uk-cover")));
            }
        });
    });
});