/*! UIkit 2.11.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    var Animations;

    UI.component('switcher', {

        defaults: {
            connect : false,
            toggle  : ">*",
            active  : 0,
            animation: false
        },

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
                    active   = toggles.filter(".uk-active");

                if (active.length) {
                    this.show(active);
                } else {
                    active = toggles.eq(this.options.active);
                    this.show(active.length ? active : toggles.eq(0));
                }
            }

        },

        show: function(tab) {

            tab = isNaN(tab) ? $(tab) : this.find(this.options.toggle).eq(tab);

            var $this = this, active = tab, animation = Animations[this.options.animation] || Animations['none'];

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

                        animation.apply($this, [current, next]).then(function(){

                            current.removeClass("uk-active");
                            next.addClass("uk-active");
                            UI.Utils.checkDisplay(next);
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

        'fade': function(current, next, dir) {

            var d = $.Deferred();

            if (current) {
                current.removeClass('uk-active');
            }

            next.fadeIn(300, function(){
                next.css({opacity:'', display:''});
                d.resolve();
            });

            return d.promise();
        }
    };


    // init code
    UI.ready(function(context) {

        $("[data-uk-switcher]", context).each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
            }
        });
    });

})(jQuery, jQuery.UIkit);
