/*! UIkit 2.16.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    var Animations;

    UI.component('switcher', {

        defaults: {
            connect   : false,
            toggle    : ">*",
            active    : 0,
            animation : false,
            duration  : 200
        },

        animating: false,

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-switcher]", context).each(function() {
                    var switcher = UI.$(this);

                    if (!switcher.data("switcher")) {
                        var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-@-switcher")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = UI.$(this.options.connect);

                this.connect.find(".@-active").removeClass(".@-active");

                // delegate switch commands within container content
                if (this.connect.length) {

                    this.connect.on("click", '[data-@-switcher-item]', function(e) {

                        e.preventDefault();

                        var item = UI.$(this).data(UI._prefix+'SwitcherItem');

                        if ($this.index == item) return;

                        switch(item) {
                            case 'next':
                            case 'previous':
                                $this.show($this.index + (item=='next' ? 1:-1));
                                break;
                            default:
                                $this.show(item);
                        }
                    });
                }

                var toggles = this.find(this.options.toggle),
                    active  = toggles.filter(".@-active");

                if (active.length) {
                    this.show(active, false);
                } else {

                    if (this.options.active===false) return;

                    active = toggles.eq(UI.prefix(this.options.active));
                    this.show(active.length ? active : toggles.eq(0), false);
                }

                this.on(UI.prefix('changed.@.dom'), function() {
                    $this.connect = UI.$($this.options.connect);
                });
            }

        },

        show: function(tab, animate) {

            if (this.animating) {
                return;
            }

            if (isNaN(tab)) {
                tab = UI.$(tab);
            } else {

                var toggles = this.find(this.options.toggle);

                tab = tab < 0 ? toggles.length-1 : tab;
                tab = toggles.eq(toggles[tab] ? tab : 0);
            }

            var $this     = this,
                active    = UI.$(tab),
                animation = Animations[this.options.animation] || function(current, next) {

                    if (!$this.options.animation) {
                        return Animations.none.apply($this);
                    }

                    var anim = $this.options.animation.split(',');

                    if (anim.length == 1) {
                        anim[1] = anim[0];
                    }

                    anim[0] = anim[0].trim();
                    anim[1] = anim[1].trim();

                    return coreAnimation.apply($this, [anim, current, next]);
                };

            if (animate===false || !UI.support.animation) {
                animation = Animations.none;
            }

            if (active.hasClass("@-disabled")) return;

            this.find(this.options.toggle).filter(".@-active").removeClass("@-active");
            active.addClass("@-active");

            if (this.options.connect && this.connect.length) {

                this.index = this.find(this.options.toggle).index(active);

                if (this.index == -1 ) {
                    this.index = 0;
                }

                this.connect.each(function() {

                    var container = UI.$(this),
                        children  = UI.$(container.children()),
                        current   = UI.$(children.filter('.@-active')),
                        next      = UI.$(children.eq($this.index));

                        $this.animating = true;

                        animation.apply($this, [current, next]).then(function(){

                            current.removeClass("@-active");
                            next.addClass("@-active");
                            UI.Utils.checkDisplay(next, true);

                            $this.animating = false;
                        });
                });
            }

            this.trigger("show.uk.switcher", [active]);
        }
    });

    Animations = {

        'none': function() {
            var d = $.Deferred();
            d.resolve();
            return d.promise();
        },

        'fade': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-fade', current, next]);
        },

        'slide-bottom': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-bottom', current, next]);
        },

        'slide-top': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-top', current, next]);
        },

        'slide-vertical': function(current, next, dir) {

            var anim = ['@-animation-slide-top', '@-animation-slide-bottom'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-left': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-left', current, next]);
        },

        'slide-right': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-right', current, next]);
        },

        'slide-horizontal': function(current, next, dir) {

            var anim = ['@-animation-slide-left', '@-animation-slide-right'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'scale': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-scale-up', current, next]);
        }
    };

    UI.switcher.animations = Animations;


    // helpers

    function coreAnimation(cls, current, next) {

        var d = $.Deferred(), clsIn = UI.prefix(cls), clsOut = cls, release;

        if (next[0]===current[0]) {
            d.resolve();
            return d.promise();
        }

        if (typeof(cls) == 'object') {
            clsIn  = cls[0];
            clsOut = cls[1] || cls[0];
        }

        release = function() {

            if (current) current.hide().removeClass(UI.prefix('@-active '+clsOut+' @-animation-reverse'));

            next.addClass(clsIn).one(UI.support.animation.end, function() {

                next.removeClass(''+clsIn+'').css({opacity:'', display:''});

                d.resolve();

                if (current) current.css({opacity:'', display:''});

            }.bind(this)).show();
        };

        next.css('animation-duration', this.options.duration+'ms');

        if (current && current.length) {

            current.css('animation-duration', this.options.duration+'ms');

            current.css('display', 'none').addClass(UI.prefix(clsOut+' @-animation-reverse')).one(UI.support.animation.end, function() {
                release();
            }.bind(this)).css('display', '');

        } else {
            next.addClass('@-active');
            release();
        }

        return d.promise();
    }

})(jQuery, UIkit);
