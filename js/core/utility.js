/*! UIkit 2.14.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    var stacks = [];

    UI.component('stackMargin', {

        defaults: {
            'cls': '@-margin-small-top'
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-margin]", context).each(function() {

                    var ele = UI.$(this), obj;

                    if (!ele.data("stackMargin")) {
                        obj = UI.stackMargin(ele, UI.Utils.options(ele.attr("data-@-margin")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns = this.element.children();

            if (!this.columns.length) return;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.process();
                };

                $(function() {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 20);
            })());

            UI.$html.on("changed.uk.dom", function(e) {
                $this.columns  = $this.element.children();
                $this.process();
            });

            this.on("display.uk.check", function(e) {
                $this.columns = $this.element.children();
                if(this.element.is(":visible")) this.process();
            }.bind(this));

            stacks.push(this);
        },

        process: function() {

            var $this = this;

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

            if (offset === false) return;

            this.columns.each(function() {

                var column = UI.$(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass($this.options.cls);
                    } else {

                        if (column.position().top >= offset) {
                            skip = column.addClass($this.options.cls);
                        }
                    }
                }
            });

            return this;
        },

        revert: function() {
            this.columns.removeClass(this.options.cls);
            return this;
        }
    });

})(jQuery, UIkit);
