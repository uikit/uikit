/*! UIkit 2.27.4 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-grid-parallax', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    var parallaxes  = [], checkParallaxes = function() {

            requestAnimationFrame(function(){
                for (var i=0; i < parallaxes.length; i++) {
                    parallaxes[i].process();
                }
            });
        };


    UI.component('gridparallax', {

        defaults: {
            target    : false,
            smooth    : 150,
            translate : 150
        },

        boot: function() {

            // listen to scroll and resize
            UI.$doc.on('scrolling.uk.document', checkParallaxes);
            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(){
                checkParallaxes();
            }, 50));

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-parallax]', context).each(function() {

                    var parallax = UI.$(this);

                    if (!parallax.data('gridparallax')) {
                        UI.gridparallax(parallax, UI.Utils.options(parallax.attr('data-uk-grid-parallax')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.initItems().process();
            parallaxes.push(this);

            UI.$win.on('load resize orientationchange', (function() {

                var fn = function() {
                    var columns  = getcolumns($this.element);

                    $this.element.css('margin-bottom', '');

                    if (columns > 1) {
                        $this.element.css('margin-bottom', $this.options.translate + parseInt($this.element.css('margin-bottom')));
                    }
                };

                UI.$(function() { fn(); });

                return UI.Utils.debounce(fn, 50);
            })());
        },

        initItems: function() {

            var smooth = this.options.smooth;

            this.items = (this.options.target ? this.element.find(this.options.target) : this.element.children()).each(function(){
                UI.$(this).css({
                    transition: 'transform '+smooth+'ms linear',
                    transform: ''
                });
            });

            return this;
        },

        process: function() {

            var percent  = percentageInViewport(this.element),
                columns  = getcolumns(this.element),
                items    = this.items,
                mods     = [(columns-1)];

            if (columns == 1 || !percent) {
                items.css('transform', '');
                return;
            }

            while(mods.length < columns) {
               if (!(mods[mods.length-1] - 2)) break;
               mods.push(mods[mods.length-1] - 2);
            }

            var translate  = this.options.translate, percenttranslate = percent * translate;

            items.each(function(idx, ele, translate){
                translate = mods.indexOf((idx+1) % columns) != -1 ? percenttranslate : percenttranslate / 8;
                UI.$(this).css('transform', 'translate3d(0,'+(translate)+'px, 0)');
            });
        }

    });


    function getcolumns(element) {

        var children = element.children(),
            first    = children.filter(':visible:first'),
            top      = first[0].offsetTop + first.outerHeight();

        for (var column=0;column<children.length;column++) {
            if (children[column].offsetTop >= top)  break;
        }

        return column || 1;
    }

    function percentageInViewport(element) {

        var top       = element.offset().top,
            height    = element.outerHeight(),
            scrolltop = UI.$win.scrollTop(),
            wh        = window.innerHeight,
            distance, percentage, percent;

        if (top > (scrolltop + wh)) {
            percent = 0;
        } else if ((top + height) < scrolltop) {
            percent = 1;
        } else {

            if ((top + height) < wh) {
                percent = (scrolltop < wh ? scrolltop : scrolltop - wh) / (top+height);
            } else {

                distance   = (scrolltop + wh) - top;
                percentage = Math.round(distance / ((wh + height) / 100));
                percent    = percentage/100;
            }

            if (top < wh) {
                percent = percent * scrolltop / ((top + height) - wh);
            }
        }

        return percent > 1 ? 1:percent;
    }
});
