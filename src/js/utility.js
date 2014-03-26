(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange', stacks = [];

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

        stacks.push(this);
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


    UI["stackMargin"] = StackMargin;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-margin]").each(function() {
            var ele = $(this), obj;

            if (!ele.data("stackMargin")) {
                obj = new StackMargin(ele, UI.Utils.options(ele.attr("data-uk-margin")));
            }
        });
    });


    $(document).on("uk-check-display", function(e) {
        stacks.forEach(function(item) {
            if(item.element.is(":visible")) item.process();
        });
    });

})(jQuery, jQuery.UIkit);