/*! UIkit 2.16.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    var grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            "target" : false,
            "row"    : true
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-grid-match]", context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data("gridMatchHeight")) {
                        obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr("data-@-grid-match")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.match();
                };

                $(function() {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 50);
            })());

            UI.$html.on("changed.uk.dom", function(e) {
                $this.columns  = $this.element.children();
                $this.elements = $this.options.target ? $this.find($this.options.target) : $this.columns;
                $this.match();
            });

            this.on("display.uk.check", function(e) {
                if(this.element.is(":visible")) this.match();
            }.bind(this));

            grids.push(this);
        },

        match: function() {

            UI.Utils.matchHeights(this.elements, this.options);

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }
    });

    UI.component('gridMargin', {

        defaults: {
            "cls": "@-grid-margin"
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-grid-margin]", context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data("gridMargin")) {
                        obj = UI.gridMargin(grid, UI.Utils.options(grid.attr("data-@-grid-margin")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });

    // helper

    UI.Utils.matchHeights = function(elements, options) {

        elements = $(elements).css('min-height', '');
        options  = $.extend({ row : true }, options);

        var firstvisible = elements.filter(":visible:first");

        if (!firstvisible.length) return;

        var stacked      = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100 ? true : false,
            max          = 0,
            matchHeights = function(group){

                if(group.length < 2) return;

                var max = 0;

                group.each(function() {
                    max = Math.max(max, $(this).outerHeight());
                }).each(function(i) {

                    var element = $(this),
                    height  = max - (element.outerHeight() - element.height());

                    element.css('min-height', height + 'px');
                });
            };

        if (stacked) return;

        if(options.row) {

            firstvisible.width(); // force redraw

            setTimeout(function(){

                var lastoffset = false, group = [];

                elements.each(function(i) {

                    var ele = $(this), offset = ele.offset().top;

                    if(offset != lastoffset && group.length) {

                        matchHeights($(group));
                        group  = [];
                        offset = ele.offset().top;
                    }

                    group.push(ele);
                    lastoffset = offset;
                });

                if(group.length) {
                    matchHeights($(group));
                }

            }, 0);

        } else {
            matchHeights(elements);
        }
    };

})(jQuery, UIkit);
