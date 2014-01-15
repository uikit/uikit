(function($, UI) {

    "use strict";

    var GridMatch = function(element, options) {

        var $element = $(element);

        if($element.data("gridMatchHeight")) return;

        this.options  = $.extend({}, GridMatch.defaults, options);

        var matchHeight = new UI.matchHeight($element, this.options);

        $element.data("gridMatchHeight", matchHeight);
    };


    GridMatch.defaults = {
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

    UI["gridMatch"]  = GridMatch;
    UI["gridMargin"] = GridMargin;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this), obj;

            if (grid.is("[data-uk-grid-match]") && !grid.data("gridMatchHeight")) {
                obj = new GridMatch(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("gridMargin")) {
                obj = new GridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
            }
        });
    });

})(jQuery, jQuery.UIkit);