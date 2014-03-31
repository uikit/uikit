(function($, UI) {

    "use strict";

    var Slideshow = function(element, options) {

        var $this            = this,
            $element         = $(element),
            $container       = $element.find(" > ul "),
            $firstItem       = $container.find(" > li:first-child ");
            this.slides      = $element.find(" > ul > li ");
            this.slidesCount = this.slides.length;
            this.active      = 0,
            this.animating   = false;

        if($element.data("slideshow")) return;

        this.options = $.extend({}, Slideshow.defaults, options);

        // Set animation effect
        $element.addClass(this.options.animation);

        // set container height
        $container.css({"height":this.slides.height()});
        $firstItem.addClass("uk-active");

        // set background image from img
        this.slides.each(function() {

            var $this = $(this);

            $this.css({"background-image":"url("+ $this.find(">img").attr('src') + ")"});

        });

        $element.on("click", this.options.next, function(e) {
            e.preventDefault();
            $this.navigate('next');
        });

        $element.on("click", this.options.previous, function(e) {
            e.preventDefault();
            $this.navigate('previous');
        });

    };

    $.extend(Slideshow.prototype, {

        navigate: function(direction) {

            if (this.animating) return;

            this.animating = true;

            var activeSlide = $(this.slides[this.active]),
                $this = this;

            if ( direction === 'next' ) {
                $(this.slides[this.active]).addClass('navOutNext');
                this.active = this.active < this.slidesCount - 1 ? this.active + 1 : 0;
                $(this.slides[this.active]).addClass('navInNext');
            }

            else if ( direction === 'previous' ) {
                $(this.slides[this.active]).addClass('navOutPrev');
                this.active = this.active > 0 ? this.active - 1 : this.slidesCount - 1;
                $(this.slides[this.active]).addClass('navInPrev');
            }

            var nextSlide = $(this.slides[this.active]);

            nextSlide.on('transitionend animationend webkitAnimationEnd', function() {
                activeSlide.removeClass("uk-active navOutNext");
                nextSlide.addClass("uk-active").removeClass("navInNext");
                $this.animating = false;
            });

        }

    });

    Slideshow.defaults = {
        animation : "fxPressAway",
        duration : 200,
        next : ".uk-slidenav-next",
        previous : ".uk-slidenav-previous",
        autoplay : false
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