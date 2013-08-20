(function($, UI, $win) {

    "use strict";

    var active = false,
        html   = $("html"),

        Modal  = function(element, options) {

            var $this = this;

            this.element = $(element);
            this.options = $.extend({
                keyboard: true,
                show: false,
                bgclose: true
            }, options);

            this.transition = UI.support.transition;
            this.dialog     = this.element.find(".uk-modal-dialog");

            this.element.on("click", ".uk-modal-close", function(e) {
                e.preventDefault();
                $this.hide();

            }).on("click", function(e) {

                var target = $(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }

            });

            if (this.options.keyboard) {
                $(document).on('keyup.ui.modal.escape', function(e) {
                    if (active && e.which == 27 && $this.isActive()) $this.hide();
                });
            }
        };

    $.extend(Modal.prototype, {

        transition: false,

        toggle: function() {
            this[this.isActive() ? "hide" : "show"]();
        },

        show: function() {

            var $this = this;

            if (this.isActive()) return;
            if (active) active.hide(true);

            this.resize();

            this.element.removeClass("uk-open").show();

            active = this;
            html.addClass("uk-modal-page").height(); // force browser engine redraw

            this.element.addClass("uk-open").trigger("uk.modal.show");
        },

        hide: function(force) {

            if (!this.isActive()) return;

            if (!force && UI.support.transition) {

                var $this = this;

                this.element.one(UI.support.transition.end, function() {
                    $this._hide();
                }).removeClass("uk-open");

            } else {

                this._hide();
            }
        },

        resize: function() {

            this.dialog.css("margin-left", "");

            var modalwidth = parseInt(this.dialog.css("width"), 10),
                inview     = (modalwidth + parseInt(this.dialog.css("margin-left"),10) + parseInt(this.dialog.css("margin-right"),10)) < $win.width();

            this.dialog.css("margin-left", modalwidth && inview ? -1*Math.ceil(modalwidth/2) : "");
        },

        _hide: function() {

            this.element.hide().removeClass("uk-open");

            html.removeClass("uk-modal-page");

            if(active===this) active = false;

            this.element.trigger("uk.modal.hide");
        },

        isActive: function() {
            return (active == this);
        }

    });

    var ModalTrigger = function(element, options) {

        var $this    = this,
            $element = $(element);

        this.options = $.extend({
            "target": $element.is("a") ? $element.attr("href") : false
        }, options);

        this.element = $element;

        this.modal = new Modal(this.options.target, options);

        $element.on("click", function(e) {
            e.preventDefault();
            $this.show();
        });

        //methods

        $.each(["show", "hide", "isActive"], function(index, method) {
            $this[method] = function() { return $this.modal[method](); };
        });
    };

    ModalTrigger.Modal = Modal;

    UI["modal"] = ModalTrigger;

    // init code
    $(document).on("click.modal.uikit", "[data-uk-modal]", function(e) {
        var ele = $(this);

        if (!ele.data("modal")) {
            ele.data("modal", new ModalTrigger(ele, UI.Utils.options(ele.data("uk-modal"))));

            ele.data("modal").show();
        }

    });

    $win.on("resize orientationchange", UI.Utils.debounce(function(){

        if(active) active.resize();

    }, 150));

})(jQuery, jQuery.UIkit, jQuery(window));