(function($, UI) {

    "use strict";

    var ButtonRadio = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("buttonRadio")) return;

        this.options = $.extend({}, ButtonRadio.defaults, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.find($this.options.target).not(this).removeClass("uk-active").blur();
            $element.trigger("change", [$(this).addClass("uk-active")]);
        });

        this.element.data("buttonRadio", this);
    };

    $.extend(ButtonRadio.prototype, {

        getSelected: function() {
            this.element.find(".uk-active");
        }

    });

    ButtonRadio.defaults = {
        "target": ".uk-button"
    };

    var ButtonCheckbox = function(element, options) {

        var $element = $(element);

        if($element.data("buttonCheckbox")) return;

        this.options = $.extend({}, ButtonCheckbox.defaults, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.trigger("change", [$(this).toggleClass("uk-active").blur()]);
        });

        this.element.data("buttonCheckbox", this);
    };

    $.extend(ButtonCheckbox.prototype, {

        getSelected: function() {
            this.element.find(".uk-active");
        }

    });

    ButtonCheckbox.defaults = {
        "target": ".uk-button"
    };

    var Button = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("button")) return;

        this.options = $.extend({}, Button.defaults, options);
        this.element = $element.on("click", function(e) {
            e.preventDefault();
            $this.toggle();
            $element.trigger("change", [$element.blur().hasClass("uk-active")]);
        });

        this.element.data("button", this);
    };

    $.extend(Button.prototype, {

        options: {},

        toggle: function() {
            this.element.toggleClass("uk-active");
        }

    });

    Button.defaults = {};

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