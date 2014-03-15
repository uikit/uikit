(function($, UI, $win) {

    "use strict";

    var active = false,
        html   = $("html"),

        Modal  = function(element, options) {

            var $this = this;

            this.element = $(element);
            this.options = $.extend({}, Modal.defaults, options);

            this.transition = UI.support.transition;
            this.dialog     = this.element.find(".uk-modal-dialog");

            this.scrollable = (function(){
                var scrollable = $this.dialog.find('.uk-overflow-container:first');
                return scrollable.length ? scrollable : false;
            })();

            this.element.on("click", ".uk-modal-close", function(e) {
                e.preventDefault();
                $this.hide();

            }).on("click", function(e) {

                var target = $(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }

            });
        };

    $.extend(Modal.prototype, {

        scrollable: false,
        transition: false,

        toggle: function() {
            return this[this.isActive() ? "hide" : "show"]();
        },

        show: function() {

            var $this = this;

            if (this.isActive()) return;
            if (active) active.hide(true);

            this.element.removeClass("uk-open").show();

            this.resize();

            active = this;
            html.addClass("uk-modal-page").height(); // force browser engine redraw

            this.element.addClass("uk-open").trigger("uk.modal.show");

            return this;
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

            return this;
        },

        resize: function() {
            
            var paddingdir = "padding-" + (UI.langdirection == 'left' ? "right":"left");

            this.scrollbarwidth = window.innerWidth - html.width();
            
            html.css(paddingdir, this.scrollbarwidth);

            this.element.css(paddingdir, "");

            if (this.dialog.offset().left > this.scrollbarwidth) {
                this.element.css(paddingdir, this.scrollbarwidth);
            }

            if (this.scrollable) {

                this.scrollable.css("height", 0);

                var offset = Math.abs(parseInt(this.dialog.css("margin-top"), 10)),
                    dh     = this.dialog.outerHeight(),
                    wh     = window.innerHeight,
                    h      = wh - 2*(offset < 20 ? 20:offset) - dh;

                this.scrollable.css("height", h < this.options.minScrollHeight ? "":h);
            }
        },

        _hide: function() {

            this.element.hide().removeClass("uk-open");

            html.removeClass("uk-modal-page").css("padding-" + (UI.langdirection == 'left' ? "right":"left"), "");

            if(active===this) active = false;

            this.element.trigger("uk.modal.hide");
        },

        isActive: function() {
            return (active == this);
        }

    });

    Modal.dialog = {
        tpl : '<div class="uk-modal"><div class="uk-modal-dialog"></div></div>'
    };

    Modal.defaults = {
        keyboard: true,
        show: false,
        bgclose: true,
        minScrollHeight: 150
    };


    var ModalTrigger = function(element, options) {

        var $this    = this,
            $element = $(element);

        if($element.data("modal")) return;

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

        this.element.data("modal", this);
    };


    ModalTrigger.dialog = function(content, options) {

        var modal = new Modal($(Modal.dialog.tpl).appendTo("body"), options);

        modal.element.on("uk.modal.hide", function(){
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data("modalPersistParent"));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    ModalTrigger.alert = function(content, options) {

        ModalTrigger.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary uk-modal-close">Ok</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options)).show();
    };

    ModalTrigger.confirm = function(content, onconfirm, options) {

        onconfirm = $.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = ModalTrigger.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary js-modal-confirm">Ok</button> <button class="uk-button uk-modal-close">Cancel</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options));

        modal.element.find(".js-modal-confirm").on("click", function(){
            onconfirm();
            modal.hide();
        });

        modal.show();
    };

    ModalTrigger.Modal = Modal;

    UI["modal"] = ModalTrigger;

    // init code
    $(document).on("click.modal.uikit", "[data-uk-modal]", function(e) {

        var ele = $(this);

        if(ele.is("a")) {
            e.preventDefault();
        }

        if (!ele.data("modal")) {
            var modal = new ModalTrigger(ele, UI.Utils.options(ele.attr("data-uk-modal")));
            modal.show();
        }

    });

    // close modal on esc button
    $(document).on('keydown.modal.uikit', function (e) {

        if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
            e.preventDefault();
            active.hide();
        }
    });

    $win.on("resize orientationchange", UI.Utils.debounce(function(){

        if(active) active.resize();

    }, 150));


    // helper functions
    function setContent(content, modal){

        if(!modal) return;

        if (typeof content === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : $(content);

            if(content.parent().length) {
                modal.persist = content;
                modal.persist.data("modalPersistParent", content.parent());
            }
        }else if (typeof content === 'string' || typeof content === 'number') {
                // just insert the data as innerHTML
                content = $('<div></div>').html(content);
        }else {
                // unsupported data type!
                content = $('<div></div>').html('$.UIkitt.modal Error: Unsupported data type: ' + typeof content);
        }

        content.appendTo(modal.element.find('.uk-modal-dialog'));

        return modal;
    }

})(jQuery, jQuery.UIkit, jQuery(window));