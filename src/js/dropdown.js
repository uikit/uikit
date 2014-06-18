(function($, UI) {

    "use strict";

    var active = false;

    UI.component('dropdown', {

        defaults: {
           "mode": "hover",
           "remaintime": 800,
           "justify": false,
           "boundary": $(window),
           "delay": 0
        },

        remainIdle: false,
        hoverDelay: false,

        init: function() {

            var $this = this;

            this.dropdown = this.find(".uk-dropdown");

            this.centered  = this.dropdown.hasClass("uk-dropdown-center");
            this.justified = this.options.justify ? $(this.options.justify) : false;

            this.boundary  = $(this.options.boundary);
            this.flipped   = this.dropdown.hasClass('uk-dropdown-flip');

            if(!this.boundary.length) {
                this.boundary = $(window);
            }

            if (this.options.mode == "click" || UI.support.touch) {

                this.on("click", function(e) {

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

                        if ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length) {
                            $this.element.removeClass("uk-open");
                            active = false;
                        }
                    }
                });

            } else {

                this.on("mouseenter", function(e) {

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if ($this.hoverDelay) {
                        clearTimeout($this.hoverDelay);
                    }

                    $this.hoverDelay = setTimeout(function() {

                        $this.show();

                    }, $this.options.delay );

                }).on("mouseleave", function() {

                    if ( $this.hoverDelay ) {
                        clearTimeout($this.hoverDelay);
                    }

                    $this.remainIdle = setTimeout(function() {

                        $this.element.removeClass("uk-open");
                        $this.remainIdle = false;

                        if (active && active[0] == $this.element[0]) active = false;

                    }, $this.options.remaintime);

                }).on("click", function(e){

                    var $target = $(e.target);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                        e.preventDefault();
                    }

                    $this.show();
                });
            }
        },

        show: function(){

            if (active && active[0] != this.element[0]) {
                active.removeClass("uk-open");
            }

            this.checkDimensions();
            this.element.addClass("uk-open");
            this.trigger('uk.dropdown.show', [this]);
            active = this.element;

            this.registerOuterClick();
        },

        registerOuterClick: function(){

            var $this = this;

            $(document).off("click.outer.dropdown");

            setTimeout(function() {
                $(document).on("click.outer.dropdown", function(e) {

                    var $target = $(e.target);

                    if (active && active[0] == $this.element[0] && ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length)) {
                        active.removeClass("uk-open");
                        $(document).off("click.outer.dropdown");
                    }
                });
            }, 10);
        },

        checkDimensions: function() {

            if(!this.dropdown.length) return;

            if (this.justified && this.justified.length) {
                this.dropdown.css("min-width", "");
            }

            var $this     = this,
                dropdown  = this.dropdown.css("margin-" + $.UIkit.langdirection, ""),
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

            if ((offset.left-boundaryoffset) < 0) {

                dropdown.addClass("uk-dropdown-stack");

                if (dropdown.hasClass("uk-dropdown-flip")) {

                    if (!this.flipped) {
                        dropdown.removeClass("uk-dropdown-flip");
                        offset = dropdown.offset();
                        dropdown.addClass("uk-dropdown-flip");
                    }

                    setTimeout(function(){

                        if ((dropdown.offset().left-boundaryoffset) < 0 || !$this.flipped && (dropdown.outerWidth() + (offset.left-boundaryoffset)) < boundarywidth) {
                            dropdown.removeClass("uk-dropdown-flip");
                        }
                    }, 0);
                }

                this.trigger('uk.dropdown.stack', [this]);
            }

            dropdown.css("display", "");
        }

    });

    var triggerevent = UI.support.touch ? "click" : "mouseenter";

    // init code
    $(document).on(triggerevent+".dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {

            var dropdown = UI.dropdown(ele, UI.Utils.options(ele.data("uk-dropdown")));

            if (triggerevent=="click" || (triggerevent=="mouseenter" && dropdown.options.mode=="hover")) {
                dropdown.hoverDelay = setTimeout(function() {

                    dropdown.show();

                }, dropdown.options.delay );
            }

            if(dropdown.element.find('.uk-dropdown').length) {
                e.preventDefault();
            }
        }
    });

})(jQuery, jQuery.UIkit);