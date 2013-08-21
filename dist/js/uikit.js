/*! UIkit 1.1.0 | http://www.getuikit.com | (c) 2013 YOOtheme | MIT License */

(function($, doc) {

    "use strict";

    var UI = $.UIkit || {};

    if (UI.fn) {
        return;
    }

    UI.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!UI[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = new UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

    UI.support = {};
    UI.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }

        }());

        return transitionEnd && { end: transitionEnd };

    })();

    UI.support.touch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);


    UI.Utils = {};

    UI.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = string.indexOf("{"), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    $.UIkit = UI;
    $.fn.uk = UI.fn;

    $.UIkit.langdirection = $("html").attr("dir") == "rtl" ? "right" : "left";

})(jQuery, document);

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout,
    longTapDelay = 750, longTapTimeout;

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      touch.el.trigger('longTap');
      touch = {};
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout);
    if (tapTimeout) clearTimeout(tapTimeout);
    if (swipeTimeout) clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }

  $(document).ready(function(){
    var now, delta;

    $(document.body)
      .bind('touchstart', function(e){
        now = Date.now();
        delta = now - (touch.last || now);
        touch.el = $(parentIfText(e.originalEvent.touches[0].target));
        if(touchTimeout) clearTimeout(touchTimeout);
        touch.x1 = e.originalEvent.touches[0].pageX;
        touch.y1 = e.originalEvent.touches[0].pageY;
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);
      })
      .bind('touchmove', function(e){
        cancelLongTap();
        touch.x2 = e.originalEvent.touches[0].pageX;
        touch.y2 = e.originalEvent.touches[0].pageY;
      })
      .bind('touchend', function(e){
         cancelLongTap();

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe');
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            touch = {};
          }, 0);

        // normal tap
        else if ('last' in touch)

          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap');
            event.cancelTouch = cancelAll;
            touch.el.trigger(event);

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              touch.el.trigger('doubleTap');
              touch = {};
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null;
                touch.el.trigger('singleTap');
                touch = {};
              }, 250);
            }

          }, 0);

      })
      .bind('touchcancel', cancelAll);

    $(window).bind('scroll', cancelAll);
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback); };
  });
})(jQuery);

(function($, UI) {

    "use strict";

    var Alert = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);
        this.element = $(element).on("click", this.options.trigger, function(e) {
            e.preventDefault();
            $this.close();
        });
    };

    $.extend(Alert.prototype, {

        options: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        close: function() {

            var element = this.element.trigger("close");

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height": 0,
                    "opacity": 0,
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "margin-top": 0,
                    "margin-bottom": 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }

            function removeElement() {
                element.trigger("closed").remove();
            }
        }

    });

    UI["alert"] = Alert;

    // init code
    $(document).on("click.alert.uikit", "[data-uk-alert]", function(e) {

        var ele = $(this);
        if (!ele.data("alert")) {
            ele.data("alert", new Alert(ele, UI.Utils.options(ele.data("uk-alert"))));

            if ($(e.target).is(ele.data("alert").options.trigger)) {

                e.preventDefault();

                ele.data("alert").close();
            }
        }
    });

})(jQuery, jQuery.UIkit);

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

    // init code
    $(document).on("mouseenter.dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {
            ele.data("dropdown", new Dropdown(ele, UI.Utils.options(ele.data("uk-dropdown"))));

            if (ele.data("dropdown").options.mode == "hover") {
                ele.trigger("mouseenter");
            }
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var win         = $(window),
        event       = 'resize orientationchange',

        GridMatchHeight = function(element, options) {

            var $this = this;

            this.options  = $.extend({}, this.options, options);

            this.element  = $(element);
            this.columns  = this.element.children();
            this.elements = this.options.target ? this.element.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            win.on(event, (function() {
                var fn = function() {
                    $this.match();
                };

                $(function() {
                    fn();
                    win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 150);
            })());
        };

    $.extend(GridMatchHeight.prototype, {

        options: {
            "target": false
        },

        match: function() {

            this.revert();

            var firstvisible = this.columns.filter(":visible:first");

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100 ? true : false,
                max     = 0,
                $this   = this;

            if (stacked) return;

            this.elements.each(function() {
                max = Math.max(max, $(this).outerHeight());
            }).each(function(i) {

                var element   = $(this),
                    boxheight = element.css("box-sizing") == "border-box" ? "outerHeight" : "height",
                    box       = $this.columns.eq(i),
                    height    = (element.height() + (max - box[boxheight]()));

                element.css('min-height', height + 'px');
            });

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }

    });

    var GridMargin = function(element) {

        var $this = this;

        this.element = $(element);
        this.columns = this.element.children();

        if (!this.columns.length) return;

        win.on(event, (function() {
            var fn = function() {
                $this.process();
            };

            $(function() {
                fn();
                win.on("load", fn);
            });

            return UI.Utils.debounce(fn, 150);
        })());
    };

    $.extend(GridMargin.prototype, {

        process: function() {

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? firstvisible.offset().top : false;

            if (offset === false) return;

            this.columns.each(function() {

                var column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass("uk-grid-margin");
                    } else {
                        if (column.offset().top != offset) {
                            column.addClass("uk-grid-margin");
                            skip = true;
                        }
                    }
                }

            });

            return this;
        },

        revert: function() {
            this.columns.removeClass('uk-grid-margin');
            return this;
        }

    });

    UI["grid-match"]  = GridMatchHeight;
    UI["grid-margin"] = GridMargin;

    // init code
    $(function() {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this);

            if (grid.is("[data-uk-grid-match]") && !grid.data("grid-match")) {
                grid.data("grid-match", new GridMatchHeight(grid, UI.Utils.options(grid.data("uk-grid-match"))));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("grid-margin")) {
                grid.data("grid-margin", new GridMargin(grid, UI.Utils.options(grid.data("uk-grid-margin"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);

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

(function($, UI) {

    "use strict";

    if (UI.support.touch) {
        $("html").addClass("uk-touch");
    }

    var $win      = $(window),
        $doc      = $(document),
        Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var doc       = $("html"),
                bar       = element.find(".uk-offcanvas-bar:first"),
                dir       = bar.hasClass("uk-offcanvas-bar-flip") ? -1 : 1,
                scrollbar = dir == -1 && $win.width() < window.innerWidth ? (window.innerWidth - $win.width()) : 0;

            scrollpos = {x: window.scrollX, y: window.scrollY};

            element.addClass("uk-active");

            doc.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("uk-offcanvas-page");
            doc.css("margin-left", ((bar.outerWidth() - scrollbar) * dir)).width(); // .width() - force redraw

            bar.addClass("uk-offcanvas-bar-show").width();

            element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

                var target = $(e.target);

                if (!e.type.match(/swipe/)) {
                    if (target.hasClass("uk-offcanvas-bar")) return;
                    if (target.parents(".uk-offcanvas-bar:first").length) return;
                }

                e.stopImmediatePropagation();

                Offcanvas.hide();
            });

            $doc.on('keydown.offcanvas', function(e) {
                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

        hide: function(force) {

            var doc   = $("html"),
                panel = $(".uk-offcanvas.uk-active"),
                bar   = panel.find(".uk-offcanvas-bar:first");

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {


                doc.one($.UIkit.support.transition.end, function() {
                    doc.removeClass("uk-offcanvas-page").attr("style", "");
                    panel.removeClass("uk-active");
                    window.scrollTo(scrollpos.x, scrollpos.y);
                }).css("margin-left", "");

                setTimeout(function(){
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 50);

            } else {
                doc.removeClass("uk-offcanvas-page").attr("style", "");
                panel.removeClass("uk-active");
                bar.removeClass("uk-offcanvas-bar-show");
                window.scrollTo(scrollpos.x, scrollpos.y);
            }

            panel.off(".ukoffcanvas");
            $doc.off(".ukoffcanvas");
        }

    }, scrollpos;


    var OffcanvasTrigger = function(element, options) {

        var $this    = this,
            $element = $(element);

        this.options = $.extend({
            "target": $element.is("a") ? $element.attr("href") : false
        }, options);

        this.element = $element;

        $element.on("click", function(e) {
            e.preventDefault();
            Offcanvas.show($this.options.target);
        });
    };

    OffcanvasTrigger.offcanvas = Offcanvas;

    UI["offcanvas"] = OffcanvasTrigger;


    // init code
    $doc.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvas")) {
            ele.data("offcanvas", new OffcanvasTrigger(ele, UI.Utils.options(ele.data("uk-offcanvas"))));

            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var Nav = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);
        this.element = $(element).on("click", this.options.toggler, function(e) {
            e.preventDefault();

            var ele = $(this);

            $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
        });

        this.element.find(this.options.lists).each(function() {
            var $ele   = $(this),
                parent = $ele.parent(),
                active = parent.hasClass("uk-active");

            $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
            parent.data("list-container", $ele.parent());

            if (active) $this.open(parent, true);
        });
    };

    $.extend(Nav.prototype, {

        options: {
            "toggler": ">li.uk-parent > a[href='#']",
            "lists": ">li.uk-parent > ul",
            "multiple": false
        },

        open: function(li, noanimation) {

            var element = this.element, $li = $(li);

            if (!this.options.multiple) {

                element.children(".uk-open").not(li).each(function() {
                    if ($(this).data("list-container")) {
                        $(this).data("list-container").stop().animate({height: 0}, function() {
                            $(this).parent().removeClass("uk-open");
                        });
                    }
                });
            }

            $li.toggleClass("uk-open");

            if ($li.data("list-container")) {
                if (noanimation) {
                    $li.data('list-container').stop().height($li.hasClass("uk-open") ? "auto" : 0);
                } else {
                    $li.data('list-container').stop().animate({
                        height: ($li.hasClass("uk-open") ? getHeight($li.data('list-container').find('ul:first')) : 0)
                    });
                }
            }
        }

    });

    UI["nav"] = Nav;

    // helper

    function getHeight(ele) {
        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    // init code
    $(function() {
        $("[data-uk-nav]").each(function() {
            var nav = $(this);

            if (!nav.data("nav")) {
                nav.data("nav", new Nav(nav, UI.Utils.options(nav.data("uk-nav"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var $tooltip; // tooltip container


    var Tooltip = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element).on({
            "focus"     : function(e) { $this.show(); },
            "blur"      : function(e) { $this.hide(); },
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
            if(this.element.is("input") && this.element[0]===document.activeElement) return;
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
    $(document).on("mouseenter.tooltip.uikit focus.tooltip.uikit", "[data-uk-tooltip]", function(e) {
        var ele = $(this);

        if (!ele.data("tooltip")) {
            ele.data("tooltip", new Tooltip(ele, UI.Utils.options(ele.data("uk-tooltip")))).trigger("mouseenter");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var Switcher = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element).on("click", this.options.toggler, function(e) {
            e.preventDefault();
            $this.show(this);
        });

        if (this.options.connect) {

            this.connect = $(this.options.connect).find(".uk-active").removeClass(".uk-active").end();

            var active = this.element.find(this.options.toggler).filter(".uk-active");

            if (active.length) {
                this.show(active);
            }
        }

    };

    $.extend(Switcher.prototype, {

        options: {
            connect: false,
            toggler: ">*"
        },

        show: function(tab) {

            tab = isNaN(tab) ? $(tab) : this.element.find(this.options.toggler).eq(tab);

            var active = tab;

            if (active.hasClass("uk-disabled")) return;

            this.element.find(this.options.toggler).filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                var index = this.element.find(this.options.toggler).index(active);

                this.connect.children().removeClass("uk-active").eq(index).addClass("uk-active");
            }

            this.element.trigger("uk.switcher.show", [active]);
        }

    });

    UI["switcher"] = Switcher;

    // init code
    $(function() {
        $("[data-uk-switcher]").each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                switcher.data("switcher", new Switcher(switcher, UI.Utils.options(switcher.data("uk-switcher"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var Tab = function(element, options) {

        var $this    = this;

        this.element = $(element);
        this.options = $.extend({
            connect: false
        }, this.options, options);

        if (this.options.connect) {
            this.connect = $(this.options.connect);
        }

        if (window.location.hash) {
            var active = this.element.children().filter(window.location.hash);

            if (active.length) {
                this.element.children().removeClass('uk-active').filter(active).addClass("uk-active");
            }
        }

        var mobiletab = $('<li class="uk-tab-responsive uk-active"><a href="javascript:void(0);"></a></li>'),
            caption   = mobiletab.find("a:first"),
            dropdown  = $('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>'),
            ul        = dropdown.find("ul");

        caption.html(this.element.find("li.uk-active:first").find("a").text());

        if (this.element.hasClass("uk-tab-bottom")) dropdown.addClass("uk-dropdown-up");
        if (this.element.hasClass("uk-tab-flip")) dropdown.addClass("uk-dropdown-flip");

        this.element.find("a").each(function(i) {

            var tab  = $(this).parent(),
                item = $('<li><a href="javascript:void(0);">' + tab.text() + '</a></li>').on("click", function(e) {
                    $this.element.data("switcher").show(i);
                });

            if (!$(this).parents(".uk-disabled:first").length) ul.append(item);
        });

        this.element.uk("switcher", {"toggler": ">li:not(.uk-tab-responsive)", "connect": this.options.connect});

        mobiletab.append(dropdown).uk("dropdown", {"mode": "click"});

        this.element.append(mobiletab).data({
            "dropdown": mobiletab.data("dropdown"),
            "mobilecaption": caption
        }).on("uk.switcher.show", function(e, tab) {
            mobiletab.addClass("uk-active");
            caption.html(tab.find("a").text());
        });

    };

    UI["tab"] = Tab;

    // init code
    $(function() {
        $("[data-uk-tab]").each(function() {
            var tab = $(this);

            if (!tab.data("tab")) {
                tab.data("tab", new Tab(tab, UI.Utils.options(tab.data("uk-tab"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var Search = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element);

        this.timer = null;
        this.value = null;
        this.input = this.element.find(".uk-search-field");
        this.form  = this.input.length ? $(this.input.get(0).form) : $();
        this.input.attr('autocomplete', 'off');

        this.input.on({
            keydown: function(event) {
                $this.form[($this.input.val()) ? 'addClass' : 'removeClass']($this.options.filledClass);

                if (event && event.which && !event.shiftKey) {

                    switch (event.which) {
                        case 13: // enter
                            $this.done($this.selected);
                            event.preventDefault();
                            break;
                        case 38: // up
                            $this.pick('prev');
                            event.preventDefault();
                            break;
                        case 40: // down
                            $this.pick('next');
                            event.preventDefault();
                            break;
                        case 27:
                        case 9: // esc, tab
                            $this.hide();
                            break;
                        default:
                            break;
                    }
                }

            },
            keyup: function(event) {
                $this.trigger();
            },
            blur: function(event) {
                setTimeout(function() { $this.hide(event); }, 200);
            }
        });

        this.form.find('button[type=reset]').bind('click', function() {
            $this.form.removeClass("uk-open").removeClass("uk-loading").removeClass("uk-active");
            $this.value = null;
            $this.input.focus();
        });

        this.dropdown = $('<div class="uk-dropdown uk-dropdown-search"><ul class="uk-nav uk-nav-search"></ul></div>').appendTo(this.form).find('.uk-nav-search');

        if (this.options.flipDropdown) {
            this.dropdown.parent().addClass('uk-dropdown-flip');
        }
    };

    $.extend(Search.prototype, {

        options: {
            source: false,
            param: 'search',
            method: 'post',
            minLength: 3,
            delay: 300,
            flipDropdown: false,
            match: ':not(.uk-skip)',
            skipClass: 'uk-skip',
            loadingClass: 'uk-loading',
            filledClass: 'uk-active',
            resultsHeaderClass: 'uk-nav-header',
            moreResultsClass: '',
            noResultsClass: '',
            listClass: 'results',
            hoverClass: 'uk-active',
            msgResultsHeader: 'Search Results',
            msgMoreResults: 'More Results',
            msgNoResults: 'No results found',
            onSelect: function(selected) { window.location = selected.data('choice').url; },
            onLoadedResults: function(results) { return results; }
        },

        request: function(options) {
            var $this = this;

            this.form.addClass(this.options.loadingClass);

            if (this.options.source) {

                $.ajax($.extend({
                    url: this.options.source,
                    type: this.options.method,
                    dataType: 'json',
                    success: function(data) {
                        data = $this.options.onLoadedResults.apply(this, [data]);
                        $this.form.removeClass($this.options.loadingClass);
                        $this.suggest(data);
                    }
                }, options));

            } else {
                this.form.removeClass($this.options.loadingClass);
            }
        },

        pick: function(item) {
            var selected = false;

            if (typeof item !== "string" && !item.hasClass(this.options.skipClass)) {
                selected = item;
            }

            if (item == 'next' || item == 'prev') {

                var items = this.dropdown.children().filter(this.options.match);

                if (this.selected) {
                    var index = items.index(this.selected);

                    if (item == 'next') {
                        selected = items.eq(index + 1 < items.length ? index + 1 : 0);
                    } else {
                        selected = items.eq(index - 1 < 0 ? items.length - 1 : index - 1);
                    }

                } else {
                    selected = items[(item == 'next') ? 'first' : 'last']();
                }

            }

            if (selected && selected.length) {
                this.selected = selected;
                this.dropdown.children().removeClass(this.options.hoverClass);
                this.selected.addClass(this.options.hoverClass);
            }
        },

        done: function(selected) {

            if (!selected) {
                this.form.submit();
                return;
            }

            if (selected.hasClass(this.options.moreResultsClass)) {
                this.form.submit();
            } else if (selected.data('choice')) {
                this.options.onSelect.apply(this, [selected]);
            }

            this.hide();
        },

        trigger: function() {

            var $this = this, old = this.value, data = {};

            this.value = this.input.val();

            if (this.value.length < this.options.minLength) {
                return this.hide();
            }

            if (this.value != old) {

                if (this.timer) window.clearTimeout(this.timer);

                this.timer = window.setTimeout(function() {
                    data[$this.options.param] = $this.value;
                    $this.request({'data': data});
                }, this.options.delay, this);
            }

            return this;
        },

        suggest: function(data) {

            if (!data) return;

            var $this  = this,
                events = {
                    'mouseover': function() { $this.pick($(this).parent()); },
                    'click': function(e) {
                        e.preventDefault();
                        $this.done($(this).parent());
                    }
                };

            if (data === false) {
                this.hide();
            } else {
                this.selected = null;
                this.dropdown.empty();

                if (this.options.msgResultsHeader) {
                    $('<li>').addClass(this.options.resultsHeaderClass + ' ' + this.options.skipClass).html(this.options.msgResultsHeader).appendTo(this.dropdown);
                }

                if (data.results && data.results.length > 0) {

                    $(data.results).each(function(i) {

                        var item = $('<li><a href="#">' + this.title + '</a></li>').data('choice', this);

                        if (this["text"]) {
                            item.find("a").append('<div>' + this.text + '</div>');
                        }

                        $this.dropdown.append(item);
                    });

                    if (this.options.msgMoreResults) {
                        $('<li>').addClass('uk-nav-divider ' + $this.options.skipClass).appendTo($this.dropdown);
                        $('<li>').addClass($this.options.moreResultsClass).html('<a href="#">' + $this.options.msgMoreResults + '</a>').appendTo($this.dropdown).on(events);
                    }

                    $this.dropdown.find("li>a").on(events);

                } else if (this.options.msgNoResults) {
                    $('<li>').addClass(this.options.noResultsClass + ' ' + this.options.skipClass).html('<a>' + this.options.msgNoResults + '</a>').appendTo(this.dropdown);
                }

                this.show();
            }
        },

        show: function() {
            if (this.visible) return;
            this.visible = true;
            this.form.addClass("uk-open");
        },

        hide: function() {
            if (!this.visible)
                return;
            this.visible = false;
            this.form.removeClass(this.options.loadingClass).removeClass("uk-open");
        }
    });

    UI["search"] = Search;

    // init code
    $(document).on("focus.search.uikit", "[data-uk-search]", function(e) {
        var ele = $(this);

        if (!ele.data("search")) {
            ele.data("search", new Search(ele, UI.Utils.options(ele.data("uk-search"))));
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var $win        = $(window),

        ScrollSpy   = function(element, options) {

            this.options = $.extend({}, this.options, options);

            var $this = this, inviewstate, initinview,
                fn = function(){

                    var inview = isInView($this);

                    if(inview && !inviewstate) {

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.element.trigger("uk-scrollspy-init");
                        }

                        $this.element.addClass("uk-scrollspy-inview").addClass($this.options.cls).width();
                        inviewstate = true;

                        $this.element.trigger("uk.scrollspy.inview");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("uk-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.element.trigger("uk.scrollspy.outview");
                    }
                };

            this.element = $(element);

            $win.on("scroll", fn).on("resize orientationchange", UI.Utils.debounce(fn, 50));

            fn();
        };

    $.extend(ScrollSpy.prototype, {

        options: {
            "cls": "uk-scrollspy-inview",
            "initcls": "uk-scrollspy-init-inview",
            "topoffset": 0,
            "leftoffset": 0,
            "repeat": false
        }

    });

    UI["scrollspy"] = ScrollSpy;


    function isInView(obj) {

        var $element = obj.element, options = obj.options;

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = obj.offset || $element.offset(), left = offset.left, top = offset.top;

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    }


    // init code
    $(function() {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                element.data("scrollspy", new ScrollSpy(element, UI.Utils.options(element.data("uk-scrollspy"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var SmoothScroll = function(element, options) {

        var $this = this;

        this.options = $.extend({
            duration: 1000,
            transition: 'easeOutExpo'
        }, options);

        this.element = $(element).on("click", function(e) {

            // get / set parameters
            var target    = ($(this.hash).length ? $(this.hash) : $("body")).offset().top,
                docheight = $(document).height(),
                winheight = $(window).height();

            if ((target + winheight) > docheight) {
                target = (target - winheight) + 50;
            }

            // animate to target and set the hash to the window.location after the animation
            $("html,body").stop().animate({scrollTop: target}, $this.options.duration, $this.options.transition);

            // cancel default click action
            return false;
        });
    };

    UI["smooth-scroll"] = SmoothScroll;


    if (!$.easing['easeOutExpo']) {
        $.easing['easeOutExpo'] = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }


    // init code
    $(document).on("click.smooth-scroll.uikit", "[data-uk-smooth-scroll]", function(e) {
        var ele = $(this);

        if (!ele.data("smooth-scroll")) {
            ele.data("smooth-scroll", new SmoothScroll(ele, UI.Utils.options(ele.data("uk-smooth-scroll")))).trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);