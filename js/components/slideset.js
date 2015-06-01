/*! UIkit 2.21.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideset", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    "use strict";

    var Animations;

    UI.component('slideset', {

        defaults: {
            default          : 1,
            animation        : 'fade',
            duration         : 200,
            filter           : '',
            delay            : false,
            controls         : false,
            autoplay         : false,
            autoplayInterval : 7000,
            pauseOnHover     : true
        },

        sets: [],

        boot: function() {

            // auto init
            UI.ready(function(context) {

                UI.$("[data-uk-slideset]", context).each(function(){

                    var ele = UI.$(this);

                    if(!ele.data("slideset")) {
                        var plugin = UI.slideset(ele, UI.Utils.options(ele.attr("data-uk-slideset")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.activeSet = false;
            this.list      = this.element.find('.uk-slideset');
            this.nav       = this.element.find('.uk-slideset-nav');
            this.controls  = this.options.controls ? UI.$(this.options.controls) : this.element;

            UI.$win.on("resize load", UI.Utils.debounce(function() {
                $this.updateSets();
            }, 100));

            $this.list.addClass('uk-grid-width-1-'+$this.options.default);

            ['xlarge', 'large', 'medium', 'small'].forEach(function(bp) {

                if (!$this.options[bp]) {
                    return;
                }

                $this.list.addClass('uk-grid-width-'+bp+'-1-'+$this.options[bp]);
            });

            this.on("click.uikit.slideset", '[data-uk-slideset-item]', function(e) {

                e.preventDefault();

                if ($this.animating) {
                    return;
                }

                var set = UI.$(this).attr('data-uk-slideset-item');

                if ($this.activeSet === set) return;

                switch(set) {
                    case 'next':
                    case 'previous':
                        $this[set=='next' ? 'next':'previous']();
                        break;
                    default:
                        $this.show(parseInt(set, 10));
                }

            });

            this.controls.on('click.uikit.slideset', '[data-uk-filter]', function(e) {

                var ele = UI.$(this);

                if (ele.parent().hasClass('uk-slideset')) {
                    return;
                }

                e.preventDefault();

                if ($this.animating || $this.currentFilter == ele.attr('data-uk-filter')) {
                    return;
                }

                $this.updateFilter(ele.attr('data-uk-filter'));

                $this._hide().then(function(){

                    $this.updateSets(true, true);
                });
            });

            this.on('swipeRight swipeLeft', function(e) {
                $this[e.type=='swipeLeft' ? 'next' : 'previous']();
            });

            this.updateFilter(this.options.filter);
            this.updateSets();

            this.element.on({
                mouseenter: function() { if ($this.options.pauseOnHover) $this.hovering = true;  },
                mouseleave: function() { $this.hovering = false; }
            });

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }
        },

        updateSets: function(animate, force) {

            var $this = this, visible = this.visible, i;

            this.visible  = this.getVisibleOnCurrenBreakpoint();

            if (visible == this.visible && !force) {
                return;
            }

            this.children = this.list.children().hide();
            this.items    = this.getItems();
            this.sets     = array_chunk(this.items, this.visible);

            for (i=0;i<this.sets.length;i++) {
                this.sets[i].css({'display': 'none'});
            }

            // update nav
            if (this.nav.length && this.nav.empty()) {

                for (i=0;i<this.sets.length;i++) {
                    this.nav.append('<li data-uk-slideset-item="'+i+'"><a></a></li>');
                }

                this.nav[this.nav.children().length==1 ? 'addClass':'removeClass']('uk-invisible');
            }

            this.activeSet = false;
            this.show(0, !animate);
        },

        updateFilter: function(currentfilter) {

            var $this = this, filter;

            this.currentFilter = currentfilter;

            this.controls.find('[data-uk-filter]').each(function(){

                filter = UI.$(this);

                if (!filter.parent().hasClass('uk-slideset')) {

                    if (filter.attr('data-uk-filter') == $this.currentFilter) {
                        filter.addClass('uk-active');
                    } else {
                        filter.removeClass('uk-active');
                    }
                }
            });
        },

        getVisibleOnCurrenBreakpoint: function() {

            var breakpoint  = null,
                tmp         = UI.$('<div style="position:absolute;height:1px;top:-1000px;width:100px"><div></div></div>').appendTo('body'),
                testdiv     = tmp.children().eq(0),
                breakpoints = this.options;

                ['xlarge', 'large', 'medium', 'small'].forEach(function(bp) {

                    if (!breakpoints[bp] || breakpoint) {
                        return;
                    }

                    tmp.attr('class', 'uk-grid-width-'+bp+'-1-2').width();

                    if (testdiv.width() == 50) {
                        breakpoint = bp;
                    }
                });

                tmp.remove();

                return this.options[breakpoint] || this.options['default'];
        },

        getItems: function() {

            var items = [], filter;

            if (this.currentFilter) {

                filter = this.currentFilter || [];

                if (typeof(filter) === 'string') {
                    filter = filter.split(/,/).map(function(item){ return item.trim(); });
                }

                this.children.each(function(index){

                    var ele = UI.$(this), f = ele.attr('data-uk-filter'), infilter = filter.length ? false : true;

                    if (f) {

                        f = f.split(/,/).map(function(item){ return item.trim(); });

                        filter.forEach(function(item){
                            if (f.indexOf(item) > -1) infilter = true;
                        });
                    }

                    if(infilter) items.push(ele[0]);
                });

                items = UI.$(items);

            } else {
                items = this.list.children();
            }

            return items;
        },

        show: function(setIndex, noanimate, dir) {

            var $this = this;

            if (this.activeSet === setIndex || this.animating) {
                return;
            }

            dir = dir || (setIndex < this.activeSet ? -1:1);

            var current   = this.sets[this.activeSet] || [],
                next      = this.sets[setIndex],
                animation = this._getAnimation();

            if (noanimate || !UI.support.animation) {
                animation = Animations.none;
            }

            this.animating = true;

            if (this.nav.length) {
                this.nav.children().removeClass('uk-active').eq(setIndex).addClass('uk-active');
            }

            animation.apply($this, [current, next, dir]).then(function(){

                UI.Utils.checkDisplay(next, true);

                $this.children.hide().removeClass('uk-active');
                next.addClass('uk-active').css({'display': '', 'opacity':''});

                $this.animating = false;
                $this.activeSet = setIndex;

                UI.Utils.checkDisplay(next, true);

                $this.trigger('show.uk.slideset', [next]);
            });

        },

        _getAnimation: function() {

            var $this     = this,
                animation = Animations[this.options.animation] || Animations.none;

            if (!UI.support.animation) {
                animation = Animations.none;
            }

            return animation;
        },

        _hide: function() {

            var $this     = this,
                current   = this.sets[this.activeSet] || [],
                animation = this._getAnimation();

            this.animating = true;

            return animation.apply($this, [current, [], 1]).then(function(){
                $this.animating = false;
            });
        },

        next: function() {
            this.show(this.sets[this.activeSet + 1] ? (this.activeSet + 1) : 0, false, 1);
        },

        previous: function() {
            this.show(this.sets[this.activeSet - 1] ? (this.activeSet - 1) : (this.sets.length - 1), false, -1);
        },

        start: function() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function() {
                if (!$this.hovering && !$this.animating) $this.next();
            }, this.options.autoplayInterval);

        },

        stop: function() {
            if (this.interval) clearInterval(this.interval);
        }
    });

    Animations = {

        'none': function() {
            var d = UI.$.Deferred();
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

            if (dir == -1) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-horizontal': function(current, next, dir) {

            var anim = ['uk-animation-slide-right', 'uk-animation-slide-left'];

            if (dir == -1) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next, dir]);
        },

        'scale': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-scale-up', current, next]);
        }
    };

    UI.slideset.animations = Animations;

    // helpers

    function coreAnimation(cls, current, next, dir) {

        var d = UI.$.Deferred(),
            delay = (this.options.delay === false) ? Math.floor(this.options.duration/2) : this.options.delay,
            $this = this, clsIn, clsOut, release, i;

        dir = dir || 1;

        this.element.css('min-height', this.element.height());

        if (next[0]===current[0]) {
            d.resolve();
            return d.promise();
        }

        if (typeof(cls) == 'object') {
            clsIn  = cls[0];
            clsOut = cls[1] || cls[0];
        } else {
            clsIn  = cls;
            clsOut = clsIn;
        }

        release = function() {

            if (current && current.length) {
                current.hide().removeClass(clsOut+' uk-animation-reverse').css({'opacity':'', 'animation-delay': '', 'animation':''});
            }

            if (!next.length) {
                d.resolve();
                return;
            }

            for (i=0;i<next.length;i++) {
                next.eq(dir == 1 ? i:(next.length - i)-1).css('animation-delay', (i*delay)+'ms');
            }

            next.addClass(clsIn)[dir==1 ? 'last':'first']().one(UI.support.animation.end, function() {

                next.removeClass(''+clsIn+'').css({opacity:'', display:'', 'animation-delay':'', 'animation':''});
                d.resolve();
                $this.element.css('min-height', '');

            }).end().css('display', '');
        };

        if (next.length) {
            next.css('animation-duration', this.options.duration+'ms');
        }

        if (current && current.length) {

            current.css('animation-duration', this.options.duration+'ms')[dir==1 ? 'last':'first']().one(UI.support.animation.end, function() {
                release();
            });

            for (i=0;i<current.length;i++) {

                (function (index, ele){

                    setTimeout(function(){
                        ele.css('display', 'none').css('display', '').css('opacity', 0).addClass(clsOut+' uk-animation-reverse');
                    }.bind(this), i * delay);

                })(i, current.eq(dir == 1 ? i:(current.length - i)-1));
            }

        } else {
            release();
        }

        return d.promise();
    }

    function array_chunk(input, size) {

        var x, i = 0, c = -1, l = input.length || 0, n = [];

        if (size < 1) return null;

        while (i < l) {

            x = i % size;

            if(x) {
                n[c][x] = input[i];
            } else {
                n[++c] = [input[i]];
            }

            i++;
        }

        i = 0;
        l = n.length;

        while (i < l) {
            n[i] = jQuery(n[i]);
            i++;
        }

        return n;
    }

});
