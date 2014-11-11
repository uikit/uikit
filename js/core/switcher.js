/*! UIkit 2.12.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
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

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = $(this.options.connect).find(".uk-active").removeClass(".uk-active").end();

                // delegate switch commands within container content
                if (this.connect.length) {

                    this.connect.on("click", '[data-uk-switcher-item]', function(e) {

                        e.preventDefault();

                        var item = $(this).data('ukSwitcherItem');

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
                    active  = toggles.filter(".uk-active");

                if (active.length) {
                    this.show(active, false);
                } else {
                    active = toggles.eq(this.options.active);
                    this.show(active.length ? active : toggles.eq(0), false);
                }
            }

        },

        show: function(tab, animate) {

            if (this.animating) {
                return;
            }

            tab = isNaN(tab) ? $(tab) : this.find(this.options.toggle).eq(tab);

            var $this     = this,
                active    = tab,
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

            if (animate===false) {
                animation = Animations.none;
            }

            if (active.hasClass("uk-disabled")) return;

            this.find(this.options.toggle).filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                this.index = this.find(this.options.toggle).index(active);

                if (this.index == -1 ) {
                    this.index = 0;
                }

                this.connect.each(function() {

                    var container = $(this),
                        children  = container.children(),
                        current   = children.filter('.uk-active'),
                        next      = children.eq($this.index);

                        $this.animating = true;

                        animation.apply($this, [current, next]).then(function(){

                            current.removeClass("uk-active");
                            next.addClass("uk-active");
                            UI.Utils.checkDisplay(next, true);

                            $this.animating = false;
                        });
                });
            }

            this.trigger("uk.switcher.show", [active]);
        }
    });

    Animations = {

        'none': function() {
            var d = $.Deferred();
            d.resolve();
            return d.promise();
        },

        'fade': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-fade', current, next]);
        },

        'slide-bottom': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-bottom', current, next]);
        },

        'slide-top': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-top', current, next]);
        },

        'slide-vertical': function(current, next, dir) {

            var anim = ['uk-animation-slide-top', 'uk-animation-slide-bottom'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-left': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-left', current, next]);
        },

        'slide-right': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-right', current, next]);
        },

        'slide-horizontal': function(current, next, dir) {

            var anim = ['uk-animation-slide-left', 'uk-animation-slide-right'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'scale': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-scale-up', current, next]);
        }
    };

    UI.switcher.animations = Animations;


    // init code
    UI.ready(function(context) {

        $("[data-uk-switcher]", context).each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
            }
        });
    });


    // helpers

    function coreAnimation(cls, current, next) {

        var d = $.Deferred(), clsIn = cls, clsOut = cls, release;

        if(next[0]===current[0]) {
            d.resolve();
            return d.promise();
        }

        if (typeof(cls) == 'object') {
            clsIn  = cls[0];
            clsOut = cls[1] || cls[0];
        }

        release = function() {

            if (current) current.hide().removeClass('uk-active '+clsOut+' uk-animation-reverse');

            next.addClass(clsIn).one(UI.support.animation.end, function() {

                next.removeClass(''+clsIn+'').css({opacity:'', display:''});

                d.resolve();

                if (current) current.css({opacity:'', display:''});

            }.bind(this)).show();
        };

        next.css('animation-duration', this.options.duration+'ms');

        if (current && current.length) {

            current.css('animation-duration', this.options.duration+'ms');

            current.css('display', 'none').addClass(clsOut+' uk-animation-reverse').one(UI.support.animation.end, function() {
                release();
            }.bind(this)).css('display', '');

        } else {
            next.addClass('uk-active');
            release();
        }

        return d.promise();
    }

})(jQuery, jQuery.UIkit);
