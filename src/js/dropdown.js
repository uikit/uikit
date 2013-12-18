(function($, UI) {

    "use strict";

    var active   = false,
        Dropdown = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("dropdown")) return;

        this.options  = $.extend({}, Dropdown.defaults, options);
        this.element  = $element;
        this.dropdown = this.element.find(".uk-dropdown");

        this.centered  = this.dropdown.hasClass("uk-dropdown-center");
        this.justified = this.options.justify ? $(this.options.justify) : false;

        this.boundary  = $(this.options.boundary);

        if(!this.boundary.length) {
            this.boundary = $(window);
        }

        if (this.options.mode == "click" || UI.support.touch) {

            this.element.on("click", function(e) {

                var $target = $(e.target);

                if (!$target.parents(".uk-dropdown").length) {
                    
                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                        e.preventDefault();
                    }

                    $target.blur();
                }

                if (!$this.element.hasClass("uk-open")) {

                    $this.show();

                } else {

                    if ($target.is("a") || !$this.element.find(".uk-dropdown").find(e.target).length) {
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

                $this.show();

            }).on("mouseleave", function() {

                $this.remainIdle = setTimeout(function() {

                    $this.element.removeClass("uk-open");
                    $this.remainIdle = false;

                    if (active && active[0] == $this.element[0]) active = false;

                }, $this.options.remaintime);
            });
        }

        this.element.data("dropdown", this);
    };

    $.extend(Dropdown.prototype, {

        remainIdle: false,

        show: function(){

            if (active && active[0] != this.element[0]) {
                active.removeClass("uk-open");
            }

            this.checkDimensions();
            this.element.addClass("uk-open");
            active = this.element;

            this.registerOuterClick();
        },

        registerOuterClick: function(){

            var $this = this;

            $(document).off("click.outer.dropdown");

            setTimeout(function() {
                $(document).on("click.outer.dropdown", function(e) {

                    if (active && active[0] == $this.element[0] && ($(e.target).is("a") || !$this.element.find(".uk-dropdown").find(e.target).length)) {
                        active.removeClass("uk-open");
                        $(document).off("click.outer.dropdown");
                    }
                });
            }, 10);
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

    Dropdown.defaults = {
        "mode": "hover",
        "remaintime": 800,
        "justify": false,
        "boundary": $(window)
    };

    UI["dropdown"] = Dropdown;


    var triggerevent = UI.support.touch ? "click":"mouseenter";

    // init code
    $(document).on(triggerevent+".dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {

            var dropdown = new Dropdown(ele, UI.Utils.options(ele.data("uk-dropdown")));

            if (triggerevent=="click" || (triggerevent=="mouseenter" && dropdown.options.mode=="hover")) {
                dropdown.show();
            }

            if(dropdown.element.find('.uk-dropdown').length) {
                e.preventDefault();
            }
        }
    });

})(jQuery, jQuery.UIkit);