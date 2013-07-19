(function($, UI) {

    "use strict";

    var $tooltip; // tooltip container


    var Tooltip = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element).on({
            "mouseenter": function(e) { $this.show(); },
            "mouseleave": function(e) { $this.hide(); }
        });

        this.tip = typeof(this.options.src) === "function" ? this.options.src.call(this.element) : this.options.src;

        // disable title attribute
        this.element.attr("data-cached-title", this.element.attr("title")).attr("title", "");
    };

    $.extend(Tooltip.prototype, {

        tip: "",

        options: {
            "offset": 5,
            "pos": "top",
            "src": function() { return this.attr("title"); }
        },

        show: function() {

            if (!this.tip.length) return;

            $tooltip.css({"top": -2000, "visibility": "hidden"}).show();
            $tooltip.html('<div class="uk-tooltip-inner">' + this.tip + '</div>');

            var pos      = $.extend({}, this.element.offset(), {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}),
                width    = $tooltip[0].offsetWidth,
                height   = $tooltip[0].offsetHeight,
                offset   = typeof(this.options.offset) === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position = typeof(this.options.pos) === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tcss     = {
                    "display": "none",
                    "visibility": "visible",
                    "top": (pos.top + pos.height + height),
                    "left": pos.left
                },
                tmppos = position.split("-");

            if ((tmppos[0] == "left" || tmppos[0] == "right") && $.UIkit.langdirection == 'right') {
                tmppos[0] = tmppos[0] == "left" ? "right" : "left";
            }


            switch (tmppos[0]) {
                case 'bottom':
                    $.extend(tcss, {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2});
                    break;
                case 'top':
                    $.extend(tcss, {top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2});
                    break;
                case 'left':
                    $.extend(tcss, {top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset});
                    break;
                case 'right':
                    $.extend(tcss, {top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset});
                    break;
            }

            if (tmppos.length == 2) {
                tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);
            }

            $tooltip.css(tcss).attr("class", "uk-tooltip uk-tooltip-" + position).show();

        },

        hide: function() {
            $tooltip.hide();
        },

        content: function() {
            return this.tip;
        }

    });

    UI["tooltip"] = Tooltip;

    $(function() {
        $tooltip = $('<div class="uk-tooltip"></div>').appendTo("body");
    });

    // init code
    $(document).on("mouseenter.tooltip.uikit", "[data-uk-tooltip]", function(e) {
        var ele = $(this);

        if (!ele.data("tooltip")) {
            ele.data("tooltip", new Tooltip(ele, UI.Utils.options(ele.data("uk-tooltip")))).trigger("mouseenter");
        }
    });

})(jQuery, jQuery.UIkit);