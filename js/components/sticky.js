/*! UIkit 2.21.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sticky", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    "use strict";

    var $win         = UI.$win,
        $doc         = UI.$doc,
        sticked      = [];

    UI.component('sticky', {

        defaults: {
            top          : 0,
            bottom       : 0,
            animation    : '',
            clsinit      : 'uk-sticky-init',
            clsactive    : 'uk-active',
            getWidthFrom : '',
            boundary     : false,
            media        : false,
            target       : false,
            disabled     : false
        },

        boot: function() {

            // should be more efficient than using $win.scroll(checkscrollposition):
            UI.$doc.on('scrolling.uk.document', function() { checkscrollposition(); });
            UI.$win.on('resize orientationchange', UI.Utils.debounce(function() {

                if (!sticked.length) return;

                for (var i = 0; i < sticked.length; i++) {
                    sticked[i].reset(true);
                    sticked[i].self.computeWrapper();
                }

                checkscrollposition();
            }, 100));

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$("[data-uk-sticky]", context).each(function(){

                        var $ele = UI.$(this);

                        if(!$ele.data("sticky")) {
                            UI.sticky($ele, UI.Utils.options($ele.attr('data-uk-sticky')));
                        }
                    });

                    checkscrollposition();
                }, 0);
            });
        },

        init: function() {

            var wrapper  = UI.$('<div class="uk-sticky-placeholder"></div>'), boundary = this.options.boundary, boundtoparent;

            this.wrapper = this.element.css('margin', 0).wrap(wrapper).parent();

            this.computeWrapper();

            if (boundary) {

                if (boundary === true) {

                    boundary      = this.wrapper.parent();
                    boundtoparent = true;

                } else if (typeof boundary === "string") {
                    boundary = UI.$(boundary);
                }
            }

            this.sticky = {
                self          : this,
                options       : this.options,
                element       : this.element,
                currentTop    : null,
                wrapper       : this.wrapper,
                init          : false,
                getWidthFrom  : this.options.getWidthFrom || this.wrapper,
                boundary      : boundary,
                boundtoparent : boundtoparent,
                reset         : function(force) {

                    var finalize = function() {
                        this.element.css({"position":"", "top":"", "width":"", "left":"", "margin":"0"});
                        this.element.removeClass([this.options.animation, 'uk-animation-reverse', this.options.clsactive].join(' '));

                        this.currentTop = null;
                        this.animate    = false;
                    }.bind(this);


                    if (!force && this.options.animation && UI.support.animation) {

                        this.animate = true;

                        this.element.removeClass(this.options.animation).one(UI.support.animation.end, function(){
                            finalize();
                        }).width(); // force redraw

                        this.element.addClass(this.options.animation+' '+'uk-animation-reverse');
                    } else {
                        finalize();
                    }
                },

                check: function() {

                    if (this.options.disabled) {
                        return false;
                    }

                    if (this.options.media) {

                        switch(typeof(this.options.media)) {
                            case 'number':
                                if (window.innerWidth < this.options.media) {
                                    return false;
                                }
                                break;
                            case 'string':
                                if (window.matchMedia && !window.matchMedia(this.options.media).matches) {
                                    return false;
                                }
                                break;
                        }
                    }

                    var scrollTop      = $win.scrollTop(),
                        documentHeight = $doc.height(),
                        dwh            = documentHeight - window.innerHeight,
                        extra          = (scrollTop > dwh) ? dwh - scrollTop : 0,
                        elementTop     = this.wrapper.offset().top,
                        etse           = elementTop - this.options.top - extra;

                    return (scrollTop  >= etse);
                }
            };

            sticked.push(this.sticky);
        },

        update: function() {
            checkscrollposition(this.sticky);
        },

        enable: function() {
            this.options.disabled = false;
            this.update();
        },

        disable: function(force) {
            this.options.disabled = true;
            this.sticky.reset(force);
        },

        computeWrapper: function() {

            this.wrapper.css({
                'height' : this.element.css('position') != 'absolute' ? this.element.outerHeight() : '',
                'float'  : this.element.css("float") != "none" ? this.element.css("float") : '',
                'margin' : this.element.css("margin")
            });
        }
    });

    function checkscrollposition() {

        var stickies = arguments.length ? arguments : sticked;

        if (!stickies.length || $win.scrollTop() < 0) return;

        var scrollTop       = $win.scrollTop(),
            documentHeight  = $doc.height(),
            windowHeight    = $win.height(),
            dwh             = documentHeight - windowHeight,
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0,
            newTop, containerBottom, stickyHeight, sticky;

        for (var i = 0; i < stickies.length; i++) {

            sticky = stickies[i];

            if (!sticky.element.is(":visible") || sticky.animate) {
                continue;
            }

            if (!sticky.check()) {

                if (sticky.currentTop !== null) {
                    sticky.reset();
                }

            } else {

                if (sticky.options.top < 0) {
                    newTop = 0;
                } else {
                    stickyHeight = sticky.element.outerHeight();
                    newTop = documentHeight - stickyHeight - sticky.options.top - sticky.options.bottom - scrollTop - extra;
                    newTop = newTop < 0 ? newTop + sticky.options.top : sticky.options.top;
                }

                if (sticky.boundary && sticky.boundary.length) {

                    var bTop = sticky.boundary.position().top;

                    if (sticky.boundtoparent) {
                        containerBottom = documentHeight - (bTop + sticky.boundary.outerHeight()) + parseInt(sticky.boundary.css('padding-bottom'));
                    } else {
                        containerBottom = documentHeight - bTop - parseInt(sticky.boundary.css('margin-top'));
                    }

                    newTop = (scrollTop + stickyHeight) > (documentHeight - containerBottom - (sticky.options.top < 0 ? 0 : sticky.options.top)) ? (documentHeight - containerBottom) - (scrollTop + stickyHeight) : newTop;
                }


                if (sticky.currentTop != newTop) {

                    sticky.element.css({
                        "position" : "fixed",
                        "top"      : newTop,
                        "width"    : (typeof sticky.getWidthFrom !== 'undefined') ? UI.$(sticky.getWidthFrom).width() : sticky.element.width(),
                        "left"     : sticky.wrapper.offset().left
                    });

                    if (!sticky.init) {

                        sticky.element.addClass(sticky.options.clsinit);

                        if (location.hash && scrollTop > 0 && sticky.options.target) {

                            var $target = UI.$(location.hash);

                            if ($target.length) {

                                setTimeout((function($target, sticky){

                                    return function() {

                                        sticky.element.width(); // force redraw

                                        var offset       = $target.offset(),
                                            maxoffset    = offset.top + $target.outerHeight(),
                                            stickyOffset = sticky.element.offset(),
                                            stickyHeight = sticky.element.outerHeight(),
                                            stickyMaxOffset = stickyOffset.top + stickyHeight;

                                        if (stickyOffset.top < maxoffset && offset.top < stickyMaxOffset) {
                                            scrollTop = offset.top - stickyHeight - sticky.options.target;
                                            window.scrollTo(0, scrollTop);
                                        }
                                    };

                                })($target, sticky), 0);
                            }
                        }
                    }

                    sticky.element.addClass(sticky.options.clsactive);
                    sticky.element.css('margin', '');

                    if (sticky.options.animation && sticky.init) {
                        sticky.element.addClass(sticky.options.animation);
                    }

                    sticky.currentTop = newTop;
                }
            }

            sticky.init = true;
        }
    }

    return UI.sticky;
});
