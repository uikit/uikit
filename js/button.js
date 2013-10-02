(function($, UI) {

    "use strict";

    var ButtonRadio = function(element, options) {

        var $this = this, $element = $(element);

        this.options = $.extend({}, this.options, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.find($this.options.target).not(this).removeClass("uk-active").blur();
            $element.trigger("change", [$(this).addClass("uk-active")]);
        });
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

        this.options = $.extend({}, this.options, options);
        this.element = $element.on("click", this.options.target, function(e) {
            e.preventDefault();
            $element.trigger("change", [$(this).toggleClass("uk-active").blur()]);
        });
    };

    $.extend(ButtonCheckbox.prototype, {

        options: {
            "target": ".uk-button"
        },

        getSelected: function() {
            this.element.find(".uk-active");
        }

    });

    var Button = function(element) {

        var $this = this;

        this.element = $(element).on("click", function(e) {
            e.preventDefault();
            $this.toggle();
            $this.element.blur();
        });
    };

    $.extend(Button.prototype, {

        toggle: function() {
            this.element.toggleClass("uk-active");
        }

    });

    UI["button"] = Button;
    UI["button-checkbox"] = ButtonCheckbox;
    UI["button-radio"] = ButtonRadio;

    // init code
    $(document).on("click.button-radio.uikit", "[data-uk-button-radio]", function(e) {
        var ele = $(this);

        if (!ele.data("button-radio")) {
            ele.data("button-radio", new ButtonRadio(ele, UI.Utils.options(ele.data("uk-button-radio"))));

            if ($(e.target).is(ele.data("button-radio").options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.button-checkbox.uikit", "[data-uk-button-checkbox]", function(e) {
        var ele = $(this);

        if (!ele.data("button-checkbox")) {
            ele.data("button-checkbox", new ButtonCheckbox(ele, UI.Utils.options(ele.data("uk-button-checkbox"))));

            if ($(e.target).is(ele.data("button-checkbox").options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.button.uikit", "[data-uk-button]", function(e) {
        var ele = $(this);

        if (!ele.data("button")) {
            ele.data("button", new Button(ele, ele.data("uk-button"))).trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);