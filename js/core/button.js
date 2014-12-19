/*! UIkit 2.15.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "target": ".@-button"
        },

        boot: function() {

            // init code
            UI.$html.on("click.buttonradio.uikit", "[data-@-button-radio]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("buttonRadio")) {

                    var obj    = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-@-button-radio"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger("click");
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(ele).removeClass(UI.prefix("@-active")).blur();
                $this.trigger("change.uk.button", [ele.addClass("@-active")]);
            });

        },

        getSelected: function() {
            return this.find(".@-active");
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "target": ".@-button"
        },

        boot: function() {

            UI.$html.on("click.buttoncheckbox.uikit", "[data-@-button-checkbox]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("buttonCheckbox")) {

                    var obj    = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-@-button-checkbox"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        ele.trigger("change.uk.button", [target.toggleClass("@-active").blur()]);
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.trigger("change.uk.button", [UI.$(this).toggleClass("@-active").blur()]);
            });

        },

        getSelected: function() {
            return this.find(".@-active");
        }
    });


    UI.component('button', {

        defaults: {},

        boot: function() {

            UI.$html.on("click.button.uikit", "[data-@-button]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("button")) {

                    var obj = UI.button(ele, UI.Utils.options(ele.attr("data-@-button")));
                    ele.trigger("click");
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change.uk.button", [$this.element.blur().hasClass("@-active")]);
            });

        },

        toggle: function() {
            this.element.toggleClass("@-active");
        }
    });

})(jQuery, UIkit);
