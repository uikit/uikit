/*! UIkit 2.16.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (jQuery && UIkit) {
        component = addon(jQuery, UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideshow", ["uikit"], function() {
            return component || addon(jQuery, UIkit);
        });
    }

})(function($, UI) {

    "use strict";

    var Animations;

    UI.component('slideshow', {

        defaults: {
            animation        : "fade",
            duration         : 500,
            height           : "auto",
            start            : 0,
            autoplay         : false,
            autoplayInterval : 7000,
            videoautoplay    : true,
            videomute        : true,
            kenburns         : false,
            slices           : 15
        },

        current  : false,
        interval : null,
        hovering : false,

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-@-slideshow]', context).each(function() {

                    var slideshow = UI.$(this);

                    if (!slideshow.data("slideshow")) {
                        var obj = UI.slideshow(slideshow, UI.Utils.options(slideshow.attr("data-@-slideshow")));
                    }
                });
            });
        },

        init: function() {

            var $this = this, canvas;

            this.container     = this.element.hasClass('@-slideshow') ? this.element : UI.$(this.find('.@-slideshow'));
            this.slides        = this.container.children();
            this.slidesCount   = this.slides.length;
            this.current       = this.options.start;
            this.animating     = false;
            this.triggers      = this.find('[data-@-slideshow-item]');
            this.fixFullscreen = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && this.container.hasClass(UI.prefix('@-slideshow-fullscreen')); // viewport unit fix for height:100vh - should be fixed in iOS 8

            this.slides.each(function(index) {

                var slide = $(this),
                    media = slide.children('img,video,iframe').eq(0);

                slide.data('media', media);
                slide.data('sizer', media);

                if (media.length) {

                    var placeholder;

                    switch(media[0].nodeName) {
                        case 'IMG':

                            var cover = UI.$('<div class="@-cover-background @-position-cover"></div>').css({'background-image':'url('+ media.attr('src') + ')'});

                            media.css({'width': '100%','height': 'auto'});
                            slide.prepend(cover).data('cover', cover);
                            break;
                        case 'IFRAME':

                            var src = media[0].src;

                            media
                                .attr('src', '').on('load', function(){

                                    if (index !== $this.current || (index == $this.current && !$this.options.videoautoplay)) {
                                        $this.pausemedia(media);
                                    }

                                    if ($this.options.videomute) {
                                        $this.mutemedia(media);
                                        setTimeout(function() {
                                            $this.mutemedia(media);
                                        }, 1000);
                                    }

                                })
                                .attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1'].join(''))
                                .addClass(UI.prefix('@-position-top'));

                                // disable pointer events
                                if(!UI.support.touch) media.css('pointer-events', 'none');

                            placeholder = true;

                            if (UI.cover) {
                                UI.cover(media);
                                media.attr(UI.prefix('data-@-cover'), '{}');
                            }

                            break;
                        case 'VIDEO':
                            media.addClass(UI.prefix('@-cover-object @-position-top'));
                            placeholder = true;

                            if ($this.options.videomute) $this.mutemedia(media);
                    }

                    if (placeholder) {

                        canvas  = UI.$('<canvas></canvas>').attr({'width': media[0].width, 'height': media[0].height});
                        var img = UI.$('<img style="width:100%;height:auto;">').attr('src', canvas[0].toDataURL());

                        slide.prepend(img);
                        slide.data('sizer', img);
                    }

                } else {
                    slide.data('sizer', slide);
                }
            });

            this.on("click", '[data-@-slideshow-item]', function(e) {

                e.preventDefault();

                var slide = UI.$(this).data(UI._prefix+'SlideshowItem');

                if ($this.current == slide) return;

                switch(slide) {
                    case 'next':
                    case 'previous':
                        $this[slide=='next' ? 'next':'previous']();
                        break;
                    default:
                        $this.show(slide);
                }

                $this.stop();
            });

            // Set start slide
            this.slides.eq(this.current).addClass(UI.prefix('@-active'));
            this.triggers.filter(UI.prefix('[data-@-slideshow-item="'+this.current+'"]')).addClass(UI.prefix('@-active'));

            UI.$win.on("resize load", UI.Utils.debounce(function() {
                $this.resize();

                if ($this.fixFullscreen) {
                    $this.container.css('height', window.innerHeight);
                    $this.slides.css('height', window.innerHeight);
                }
            }, 100));

            this.resize();

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }

            if (this.options.videoautoplay && this.slides.eq(this.current).data('media')) {
                this.playmedia(this.slides.eq(this.current).data('media'));
            }

            if (this.options.kenburns) {
                this.applyKenBurns(this.slides.eq(this.current));
            }

            this.container.on({
                mouseenter: function() { $this.hovering = true;  },
                mouseleave: function() { $this.hovering = false; }
            });

            this.on('swipeRight swipeLeft', function(e) {
                $this[e.type=='swipeLeft' ? 'next' : 'previous']();
            });

            this.on('display.@.check', function(){
                if ($this.element.is(":visible")) {

                    $this.resize();

                    if ($this.fixFullscreen) {
                        $this.container.css('height', window.innerHeight);
                        $this.slides.css('height', window.innerHeight);
                    }
                }
            });
        },


        resize: function() {

            if (this.container.hasClass('@-slideshow-fullscreen')) return;

            var $this = this, height = this.options.height;

            if (this.options.height === 'auto') {

                height = 0;

                this.slides.css('height', '').each(function() {
                    height = Math.max(height, $(this).height());
                });
            }

            this.container.css('height', height);
            this.slides.css('height', height);
        },

        show: function(index, direction) {

            if (this.animating) return;

            this.animating = true;

            var $this        = this,
                current      = this.slides.eq(this.current),
                next         = this.slides.eq(index),
                dir          = direction ? direction : this.current < index ? -1 : 1,
                currentmedia = current.data('media'),
                animation    = Animations[this.options.animation] ? this.options.animation : 'fade',
                nextmedia    = next.data('media'),
                finalize     = function() {

                    if (!$this.animating) return;

                    if (currentmedia && currentmedia.is('video,iframe')) {
                        $this.pausemedia(currentmedia);
                    }

                    if (nextmedia && nextmedia.is('video,iframe')) {
                        $this.playmedia(nextmedia);
                    }

                    next.addClass("@-active");
                    current.removeClass("@-active");

                    $this.animating = false;
                    $this.current   = index;

                    UI.Utils.checkDisplay(next, UI.prefix('[class*="@-animation-"]:not(.@-cover-background.@-position-cover)'));

                    $this.trigger('show.uk.slideshow', [next]);
                };

            $this.applyKenBurns(next);

            // animation fallback
            if (!UI.support.animation) {
                animation = 'none';
            }

            current = UI.$(current);
            next    = UI.$(next);

            Animations[animation].apply(this, [current, next, dir]).then(finalize);

            $this.triggers.removeClass(UI.prefix('@-active'));
            $this.triggers.filter(UI.prefix('[data-@-slideshow-item="'+index+'"]')).addClass(UI.prefix('@-active'));
        },

        applyKenBurns: function(slide) {

            if (!this.hasKenBurns(slide)) {
                return;
            }

            var animations = [
                    '@-animation-middle-left',
                    '@-animation-top-right',
                    '@-animation-bottom-left',
                    '@-animation-top-center',
                    '', // middle-center
                    '@-animation-bottom-right'
                ],
                index = this.kbindex || 0;


            slide.data('cover').attr('class', '@-cover-background @-position-cover').width();
            slide.data('cover').addClass(['@-animation-scale', '@-animation-reverse', '@-animation-15', animations[index]].join(' '));

            this.kbindex = animations[index + 1] ? (index+1):0;
        },

        hasKenBurns: function(slide) {
            return (this.options.kenburns && slide.data('cover'));
        },

        next: function() {
            this.show(this.slides[this.current + 1] ? (this.current + 1) : 0);
        },

        previous: function() {
            this.show(this.slides[this.current - 1] ? (this.current - 1) : (this.slides.length - 1));
        },

        start: function() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function() {
                if (!$this.hovering) $this.show($this.options.start, $this.next());
            }, this.options.autoplayInterval);

        },

        stop: function() {
            if (this.interval) clearInterval(this.interval);
        },

        playmedia: function(media) {

            if (!(media && media[0])) return;


            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].play();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
                    break;
            }
        },

        pausemedia: function(media) {

            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].pause();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
                    break;
            }
        },

        mutemedia: function(media) {

            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].muted = true;
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                    break;
            }
        }
    });

    Animations = {

        'none': function() {

            var d = $.Deferred();
            d.resolve();
            return d.promise();
        },

        'scroll': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function() {

                current.removeClass(dir === 1 ? '@-slideshow-scroll-backward-out' : '@-slideshow-scroll-forward-out');
                next.css('opacity', '').removeClass(dir === 1 ? '@-slideshow-scroll-backward-in' : '@-slideshow-scroll-forward-in');
                d.resolve();

            }.bind(this));

            current.addClass(dir == 1 ? '@-slideshow-scroll-backward-out' : '@-slideshow-scroll-forward-out');
            next.addClass(dir == 1 ? '@-slideshow-scroll-backward-in' : '@-slideshow-scroll-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'swipe': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function() {

                current.removeClass(dir === 1 ? '@-slideshow-swipe-backward-out' : '@-slideshow-swipe-forward-out');
                next.css('opacity', '').removeClass(dir === 1 ? '@-slideshow-swipe-backward-in' : '@-slideshow-swipe-forward-in');
                d.resolve();

            }.bind(this));

            current.addClass(dir == 1 ? '@-slideshow-swipe-backward-out' : '@-slideshow-swipe-forward-out');
            next.addClass(dir == 1 ? '@-slideshow-swipe-backward-in' : '@-slideshow-swipe-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'scale': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1);

            current.one(UI.support.animation.end, function() {

                current.removeClass('@-slideshow-scale-out');
                next.css('opacity', '');
                d.resolve();

            }.bind(this));

            current.addClass('@-slideshow-scale-out');
            current.width(); // force redraw

            return d.promise();
        },

        'fade': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1);

            current.one(UI.support.animation.end, function() {

                current.removeClass('@-slideshow-fade-out');
                next.css('opacity', '');
                d.resolve();

            }.bind(this));

            current.addClass('@-slideshow-fade-out');
            current.width(); // force redraw

            return d.promise();
        }
    };

    UI.slideshow.animations = Animations;

});
