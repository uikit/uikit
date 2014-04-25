(function($, UI) {

    "use strict";

    var Slideshow = function(element, options) {

        this.options = $.extend({}, Slideshow.defaults, options);

        var $this            = this,
            $element         = $(element);

            this.element     = $(element);
            this.container   = this.element.find(".uk-slideshow-slides"),
            this.slides      = this.container.children(),
            this.slidesCount = this.slides.length,
            this.current     = this.options.start,
            this.animating   = false,
            this.triggers    = this.element.find('[data-uk-slideshow-slide]');

        if(this.element.data("slideshow")) return;

        // Set animation effect
        this.element.addClass(this.options.animation);

        // set background image from img
        this.slides.each(function() {

            var slide = $(this), media = slide.children('img,video,iframe').eq(0);

            slide.data('media', media);

            if(media[0]){

                switch(media[0].nodeName) {
                    case 'IMG':
                        slide.css({"background-image":"url("+ media.attr("src") + ")"});
                        break;
                    case 'IFRAME':

                        var api = 'enablejsapi=1&api=1', src = media[0].src;

                        media.attr('src', [src, (media[0].src.indexOf('?') > -1 ? '&':'?'), api].join(''));
                        break;
                }
            }

        });

        this.element.on("click", '[data-uk-slideshow-slide]', function(e) {

            e.preventDefault();

            var slide = $(this).data('ukSlideshowSlide');

            switch(slide) {
                case 'next':
                case 'previous':
                    $this[slide=='next' ? 'next':'previous']();
                    break;
                default:
                    $this.show(slide);
            }

        });

        // Set start slide
        this.slides.eq(this.current).addClass("uk-active");
        this.triggers.filter('[data-uk-slideshow-slide="'+this.current+'"]').addClass('uk-active');

        $(window).on("resize load", UI.Utils.debounce(function(){ $this.resize(); }, 100));

        this.resize();

        // Set autoplay
        if(this.options.autoplay) {
            this.start();
        }

        if(this.options.videoautoplay) {
            this.play(this.slides.eq(this.current).children('video,iframe').eq(0));
        }

        this.container.on({
            'mouseenter': function() { $this.hovering = true;  },
            'mouseleave': function() { $this.hovering = false; }
        });

        this.element.on("swipeRight swipeLeft", function(e) {

            $this[e.type=='swipeLeft' ? 'next':'previous']();

        });

        this.element.data("slideshow", this);

    };

    $.extend(Slideshow.prototype, {

        current  : false,
        interval : null,
        hovering : false,

        resize: function() {

            if (this.element.hasClass('uk-slideshow-fullscreen')) return;

            var $this = this, height = 0;

            if (this.options.height === "auto") {

                this.slides.css("height", "").each(function() {
                    height = Math.max(height, $(this).data('media').height());
                });

            } else {
                height = this.options.height;
            }

            this.container.css("height", height);
            this.slides.css("height", height);

        },

        show: function(index, direction) {

            if (this.animating) return;

            this.animating = true;

            var $this        = this,
                current      = this.slides.eq(this.current),
                next         = this.slides.eq(index),
                dir          = direction ? direction : this.current < index ? "next" : "previous",
                currentmedia = current.data('media'),
                nextmedia    = next.data('media');

            current.addClass(dir == "next" ? "uk-slide-out-next" : "uk-slide-out-prev");
            next.addClass(dir == "next" ? "uk-slide-in-next" : "uk-slide-in-prev");

            this.triggers.filter('[data-uk-slideshow-slide="'+this.current+'"]').removeClass('uk-active')
                .end()
                .filter('[data-uk-slideshow-slide="'+index+'"]').addClass('uk-active');

            next.width(); // force redraw

            next.one("transitionend animationend webkitAnimationEnd", function() {

                if(!$this.animating) return;

                if(currentmedia.is('video,iframe')) {
                    $this.pause(currentmedia);
                }

                if($this.options.videoautoplay && nextmedia.is('video,iframe')) {
                    $this.play(nextmedia);
                }

                current.removeClass("uk-active " + (dir === "next" ? "uk-slide-out-next" : "uk-slide-out-prev"));
                next.addClass("uk-active").removeClass(dir === "next" ? "uk-slide-in-next" : "uk-slide-in-prev");

                $this.animating = false;
                $this.current = index;

            });

        },

        next: function() {
            this.show(this.slides[this.current + 1] ? (this.current + 1) : 0, "next");
        },

        previous: function() {
            this.show(this.slides[this.current - 1] ? (this.current - 1) : (this.slides.length - 1), "previous");
        },

        start: function() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function() {
                if(!$this.hovering) $this.show($this.options.start, $this.next());
            }, this.options.duration);

        },

        stop: function() {
            if(this.interval) clearInterval(this.interval);
        },

        play: function(media) {

            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].play();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
                    break;
            }

        },

        pause: function(media) {

            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].pause();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
                    break;
            }

        }

    });

    Slideshow.defaults = {
        animation     : "uk-slideshow-animation-press-away",
        duration      : 4000,
        height        : "auto",
        caption       : ".uk-slideshow-caption",
        start         : 0,
        autoplay      : false,
        videoautoplay : false
    };

    UI["slideshow"] = Slideshow;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-slideshow]").each(function() {

            var slideshow = $(this);

            if (!slideshow.data("slideshow")) {
                var obj = new Slideshow(slideshow, UI.Utils.options(slideshow.attr("data-uk-slideshow")));
            }
        });
    });

})(jQuery, jQuery.UIkit);