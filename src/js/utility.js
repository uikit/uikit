(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange';

    var MatchHeight = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("matchHeight")) return;

        this.options  = $.extend({}, MatchHeight.defaults, options);

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

        this.element.data("matchHeight", this);
    };

    $.extend(MatchHeight.prototype, {

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

                var element   = $(this),
                    boxheight = element.css("box-sizing") == "border-box" ? "outerHeight" : "height",
                    box       = $this.columns.eq(i),
                    height    = (element.height() + (max - box[boxheight]()));

                element.css('min-height', height + 'px');
            });

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }

    });

    MatchHeight.defaults = {
        "target": false
    };

    var StackMargin = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("stackMargin")) return;

        this.element = $element;
        this.columns = this.element.children();
        this.options = $.extend({}, StackMargin.defaults, options);

        if (!this.columns.length) return;

        win.on(event, (function() {
            var fn = function() {
                $this.process();
            };

            $(function() {
                fn();
                win.on("load", fn);
            });

            return UI.Utils.debounce(fn, 150);
        })());

        $(document).on("uk-domready", function(e) {
            $this.columns  = $this.element.children();
            $this.process();
        });

        this.element.data("stackMargin", this);
    };

    $.extend(StackMargin.prototype, {

        process: function() {

            var $this = this;

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? firstvisible.offset().top : false;

            if (offset === false) return;

            this.columns.each(function() {

                var column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass($this.options.cls);
                    } else {
                        if (column.offset().top != offset) {
                            column.addClass($this.options.cls);
                            skip = true;
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

    StackMargin.defaults = {
        'cls': 'uk-margin-small-top'
    };


    UI["matchHeight"] = MatchHeight;
    UI["stackMargin"] = StackMargin;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-match-height],[data-uk-margin]").each(function() {
            var ele = $(this), obj;

            if (ele.is("[data-uk-match-height]") && !ele.data("matchHeight")) {
                obj = new MatchHeight(grid, UI.Utils.options(ele.attr("data-uk-match-height")));
            }

            if (ele.is("[data-uk-margin]") && !ele.data("stackMargin")) {
                obj = new StackMargin(grid, UI.Utils.options(ele.attr("data-uk-margin")));
            }
        });
    });


})(jQuery, jQuery.UIkit);