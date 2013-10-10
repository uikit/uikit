(function($, UI) {

    "use strict";

    var win         = $(window),
        event       = 'resize orientationchange',

        GridMatch = function(element, options) {

            var $this = this, $element = $(element);

            if($element.data("gridMatchHeight")) return;

            this.options  = $.extend({}, this.options, options);

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

            this.element.data("gridMatch", this);
        };

    $.extend(GridMatch.prototype, {

        options: {
            "target": false
        },

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

    var GridMargin = function(element) {

        var $this = this, $element = $(element);

        if($element.data("gridMargin")) return;

        this.element = $element;
        this.columns = this.element.children();

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

        this.element.data("gridMargin", this);
    };

    $.extend(GridMargin.prototype, {

        process: function() {

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? firstvisible.offset().top : false;

            if (offset === false) return;

            this.columns.each(function() {

                var column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass("uk-grid-margin");
                    } else {
                        if (column.offset().top != offset) {
                            column.addClass("uk-grid-margin");
                            skip = true;
                        }
                    }
                }

            });

            return this;
        },

        revert: function() {
            this.columns.removeClass('uk-grid-margin');
            return this;
        }

    });

    UI["gridMatch"]  = GridMatch;
    UI["gridMargin"] = GridMargin;

    // init code
    $(function() {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this);

            if (grid.is("[data-uk-grid-match]") && !grid.data("gridMatch")) {
                var obj = new GridMatch(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("gridMargin")) {
                var obj = new GridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
            }
        });
    });

})(jQuery, jQuery.UIkit);