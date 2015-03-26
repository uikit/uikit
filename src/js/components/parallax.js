(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-parallax", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    "use strict";

    var parallaxes      = [],
        scrolltop       = 0,
        scrolldir       = 1,
        checkParallaxes = function() {

            scrolldir = scrolltop < UI.$win.scrollTop() ? 1 : -1;
            scrolltop = UI.$win.scrollTop();

            for (var i=0; i < parallaxes.length; i++) {
                parallaxes[i].process();
            }
        };

    UI.component('parallax', {

        defaults: {
            _v : 1,
            _b : false
        },

        boot: function() {

            // listen to scroll and resize
            UI.$doc.on("scrolling.uk.document", checkParallaxes);
            UI.$win.on("load resize orientationchange", UI.Utils.debounce(checkParallaxes, 50));

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-parallax]', context).each(function() {

                    var parallax = UI.$(this);

                    if (!parallax.data("parallax")) {
                        var obj = UI.parallax(parallax, UI.Utils.options(parallax.attr("data-uk-parallax")));
                    }
                });
            });
        },

        init: function() {

            this.base  = this.options._b ? UI.$(this.options._b) : this.element;
            this.props = {};

            Object.keys(this.options).forEach(function(prop){

                if (prop[0] == '_' || prop == 'plugins') {
                    return;
                }

                var startend = String(this.options[prop]).split(','),
                    start    = parseFloat(startend[1] ? startend[0] : this._getStartValue(prop)),
                    end      = parseFloat(startend[1] ? startend[1] : startend[0]);

                this.props[prop] = { 'start': start, 'end': end, 'dir': (start < end ? 1:-1), 'diff': (start < end ? (end-start):(start-end)) };

            }.bind(this));

            parallaxes.push(this);
        },

        process: function() {

            var base    = this.base,
                offset  = base.offset(),
                height  = base.outerHeight(),
                wh      = window.innerHeight,
                percent = 0,
                top     = scrolltop < wh ? scrolltop : scrolltop - wh,
                start   = offset.top < wh ? 0 : offset.top - wh,
                end     = offset.top + height;

            if (end > (UI.$html.height() - 2*wh)) {
                end = UI.$html.height() - wh;
            }

            if (scrolltop < start) {
                percent = 0;
            } else if(scrolltop > end) {
                percent = 1;
            } else {
                percent = (start ? scrolltop : top ) / end;
            }

            this.update(percent);
        },

        update: function(percent) {

            var css = {'transform':''}, compercent = percent == 1 ? 1 : percent * (this.options._v || 1), opts, val;

            compercent = compercent > 1 ? 1 : compercent;

            if (this._percent !== undefined && this._percent == compercent) {
                return;
            }

            Object.keys(this.props).forEach(function(prop) {

                opts = this.props[prop];

                if (percent === 0) {
                    val = opts.start;
                } else if(percent === 1) {
                    val = opts.end;
                } else {
                    val = opts.start + (opts.diff * compercent * opts.dir);
                }

                switch(prop) {

                    case "x":
                        css.transform += ' translateX('+val+'px)';
                        break;
                    case "x%":
                        css.transform += ' translateX('+val+'%)';
                        break;
                    case "y":
                        css.transform += ' translateY('+val+'px)';
                        break;
                    case "y%":
                        css.transform += ' translateY('+val+'%)';
                        break;
                    case "rotate":
                        css.transform += ' rotate('+val+'deg)';
                        break;
                        break;
                    case "scale":
                        css.transform += ' scale('+val+')';
                        break;

                    default:

                        css[prop] = val;
                        break;
                }

            }.bind(this));

            this.element.css(css);

            this._percent = compercent;
        },

        _getStartValue: function(prop) {

            var value = 0;

            switch(prop) {
                default:
                    value = this.element.css(prop);
            }

            return (value || 0);
        }

    });

    return UI.parallax;
});
