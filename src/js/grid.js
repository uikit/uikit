(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange';

    var GridMatchHeight = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("gridMatchHeight")) return;

        this.options  = $.extend({}, GridMatchHeight.defaults, options);

        this.element  = $element;
        this.columns  = this.element.children();
        this.elements = this.options.target ? this.element.find(this.options.target) : this.columns;

        if (!this.columns.length) return;

        win.on(event, (function() {
            var fn = function() {
                $this.match();
            };

            $(function() {
                fn();
                win.on("load", fn);
            });

            return UI.Utils.debounce(fn, 150);
        })());

        $(document).on("uk-domready", function(e) {
            $this.columns  = $this.element.children();
            $this.elements = $this.options.target ? $this.element.find($this.options.target) : $this.columns;
            $this.match();
        });

        this.element.data("gridMatchHeight", this);
    };

    $.extend(GridMatchHeight.prototype, {

        match: function() {

            this.revert();

            var firstvisible = this.columns.filter(":visible:first");

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100 ? true : false,
                max     = 0,
                $this   = this;

            if (stacked) return;

            this.elements.each(function() {
                max = Math.max(max, $(this).outerHeight());
            }).each(function(i) {

                var element = $(this),
                    height  = max - (element.outerHeight() - element.height());

                element.css('min-height', height + 'px');
            });

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }

    });

    GridMatchHeight.defaults = {
        "target": false
    };

    var GridMargin = function(element, options) {

        var $element = $(element);

        if($element.data("gridMargin")) return;

        this.options  = $.extend({}, GridMargin.defaults, options);

        var stackMargin = new UI.stackMargin($element, this.options);

        $element.data("gridMargin", stackMargin);
    };

    GridMargin.defaults = {
        cls: 'uk-grid-margin'
    };

    UI["gridMatchHeight"]  = GridMatchHeight;
    UI["gridMargin"] = GridMargin;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this), obj;

            if (grid.is("[data-uk-grid-match]") && !grid.data("gridMatchHeight")) {
                obj = new GridMatchHeight(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("gridMargin")) {
                obj = new GridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
            }
        });
    });

})(jQuery, jQuery.UIkit);