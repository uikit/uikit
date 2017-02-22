(function($, UI) {

    "use strict";

    var active   = false,
        Dropdown = function(element, options) {

        var $this = this;

        this.options  = $.extend({}, this.options, options);
        this.element  = $(element);
        this.dropdown = this.element.find(".uk-dropdown");

        this.centered  = this.dropdown.hasClass("uk-dropdown-center");
        this.justified = this.options.justify ? $(this.options.justify) : false;

        this.boundary  = $(this.options.boundary);

        if(!this.boundary.length) {
            this.boundary = $(window);
        }

        if (this.options.mode == "click") {

            this.element.on("click", function(e) {

                if (!$(e.target).parents(".uk-dropdown").length) {
                    e.preventDefault();
                }

                if (active && active[0] != $this.element[0]) {
                    active.removeClass("uk-open");
                }

                if (!$this.element.hasClass("uk-open")) {

                    $this.checkDimensions();

                    $this.element.addClass("uk-open");

                    active = $this.element;

                    $(document).off("click.outer.dropdown");

                    setTimeout(function() {
                        $(document).on("click.outer.dropdown", function(e) {

                            if (active && active[0] == $this.element[0] && ($(e.target).is("a") || !$this.element.find(".uk-dropdown").find(e.target).length)) {
                                active.removeClass("uk-open");

                                $(document).off("click.outer.dropdown");
                            }
                        });
                    }, 10);

                } else {

                    if ($(e.target).is("a") || !$this.element.find(".uk-dropdown").find(e.target).length) {
                        $this.element.removeClass("uk-open");
                        active = false;
                    }
                }
            });

        } else {

            this.element.on("mouseenter", function(e) {

                if ($this.remainIdle) {
                    clearTimeout($this.remainIdle);
                }

                if (active && active[0] != $this.element[0]) {
                    active.removeClass("uk-open");
                }

                $this.checkDimensions();

                $this.element.addClass("uk-open");
                active = $this.element;

            }).on("mouseleave", function() {

                $this.remainIdle = setTimeout(function() {

                    $this.element.removeClass("uk-open");
                    $this.remainIdle = false;

                    if (active && active[0] == $this.element[0]) active = false;

                }, $this.options.remaintime);
            });
        }

    };

    $.extend(Dropdown.prototype, {

        remainIdle: false,

        options: {
            "mode": "hover",
            "remaintime": 800,
            "justify": false,
            "boundary": $(window)
        },

        checkDimensions: function() {

            if(!this.dropdown.length) return;

            var dropdown  = this.dropdown.css("margin-" + $.UIkit.langdirection, "").css("min-width", ""),
                offset    = dropdown.show().offset(),
                width     = dropdown.outerWidth(),
                boundarywidth  = this.boundary.width(),
                boundaryoffset = this.boundary.offset() ? this.boundary.offset().left:0;

            // centered dropdown
            if (this.centered) {
                dropdown.css("margin-" + $.UIkit.langdirection, (parseFloat(width) / 2 - dropdown.parent().width() / 2) * -1);
                offset = dropdown.offset();

                // reset dropdown
                if ((width + offset.left) > boundarywidth || offset.left < 0) {
                    dropdown.css("margin-" + $.UIkit.langdirection, "");
                    offset = dropdown.offset();
                }
            }

            // justify dropdown
            if (this.justified && this.justified.length) {

                var jwidth = this.justified.outerWidth();

                dropdown.css("min-width", jwidth);

                if ($.UIkit.langdirection == 'right') {

                    var right1   = boundarywidth - (this.justified.offset().left + jwidth),
                        right2   = boundarywidth - (dropdown.offset().left + dropdown.outerWidth());

                    dropdown.css("margin-right", right1 - right2);

                } else {
                    dropdown.css("margin-left", this.justified.offset().left - offset.left);
                }

                offset = dropdown.offset();

            }

            if ((width + (offset.left-boundaryoffset)) > boundarywidth) {
                dropdown.addClass("uk-dropdown-flip");
                offset = dropdown.offset();
            }

            if (offset.left < 0) {
                dropdown.addClass("uk-dropdown-stack");
            }

            dropdown.css("display", "");
        }

    });

    UI["dropdown"] = Dropdown;


    var triggerevent = UI.support.touch ? "touchstart":"mouseenter";

    // init code
    $(document).on(triggerevent+".dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {

            ele.data("dropdown", new Dropdown(ele, UI.Utils.options(ele.data("uk-dropdown"))));

            if(triggerevent == "mouseenter" && ele.data("dropdown").options.mode == "hover") {
                ele.trigger("mouseenter");
            }

        }
    });

})(jQuery, jQuery.UIkit);