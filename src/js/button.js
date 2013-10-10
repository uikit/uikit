(function($, UI) {

    "use strict";

    var ButtonRadio = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("buttonRadio")) return;

        this.options = $.extend({}, this.options, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.find($this.options.target).not(this).removeClass("uk-active").blur();
            $element.trigger("change", [$(this).addClass("uk-active")]);
        });

        this.element.data("buttonRadio", this);
    };

    $.extend(ButtonRadio.prototype, {

        options: {
            "target": ".uk-button"
        },

        getSelected: function() {
            this.element.find(".uk-active");
        }

    });

    var ButtonCheckbox = function(element, options) {

        var $element = $(element);

        if($element.data("buttonCheckbox")) return;

        this.options = $.extend({}, this.options, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.trigger("change", [$(this).toggleClass("uk-active").blur()]);
        });

        this.element.data("buttonCheckbox", this);
    };

    $.extend(ButtonCheckbox.prototype, {

        options: {
            "target": ".uk-button"
        },

        getSelected: function() {
            this.element.find(".uk-active");
        }

    });

    var Button = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("button")) return;

        this.options = $.extend({}, this.options, options);
        this.element = $element.on("click", function(e) {
            e.preventDefault();
            $this.toggle();
            $this.element.blur();
        });

        this.element.data("button", this);
    };

    $.extend(Button.prototype, {

        options: {},

        toggle: function() {
            this.element.toggleClass("uk-active");
        }

    });

    UI["button"]         = Button;
    UI["buttonCheckbox"] = ButtonCheckbox;
    UI["buttonRadio"]    = ButtonRadio;

    // init code
    $(document).on("click.buttonradio.uikit", "[data-uk-button-radio]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonRadio")) {
            var obj = new ButtonRadio(ele, UI.Utils.options(ele.attr("data-uk-button-radio")));

            if ($(e.target).is(obj.options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.buttoncheckbox.uikit", "[data-uk-button-checkbox]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonCheckbox")) {
            var obj = new ButtonCheckbox(ele, UI.Utils.options(ele.attr("data-uk-button-checkbox")));

            if ($(e.target).is(obj.options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.button.uikit", "[data-uk-button]", function(e) {
        var ele = $(this);

        if (!ele.data("button")) {

            var obj = new Button(ele, ele.attr("data-uk-button"));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);