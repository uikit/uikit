(function($, UI) {

    "use strict";

    var Slideshow = function(element, options) {

        var $this      = this,
            $element   = $(element),
            $container = $element.find(" > ul "),
            $firstItem = $container.find(" > li:first-child ");
            this.slides    = $element.find(" > ul > li ");
            this.slidesCount = this.slides.length;
            this.active    = 0;

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

        navigate: function( direction ) {

            var activeSlide = $(this.slides[this.active]);

            if ( direction === 'next' ) {
                this.active = this.active < this.slidesCount - 1 ? this.active + 1 : 0;
            }

            else if ( direction === 'previous' ) {
                this.active = this.active > 0 ? this.active - 1 : this.slidesCount - 1;
            }

            var nextSlide = $(this.slides[this.active]);

            activeSlide.removeClass("uk-active");
            nextSlide.addClass("uk-active");

        }

    });

    Slideshow.defaults = {
        animation : "fxSideSwing",
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