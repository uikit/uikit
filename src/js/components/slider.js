(function(addon) {
    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slider", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }
})(function(UI){

    "use strict";

    var dragging, delayIdle;

    UI.component('slider', {

        defaults: {
            centered: false,
            threshold: 10
        },

        boot:  function() {

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$("[data-uk-slider]", context).each(function(){

                        var ele = UI.$(this);

                        if (!ele.data("slider")) {
                            UI.slider(ele, UI.Utils.options(ele.attr('data-uk-slider')));
                        }
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.container = this.element.find('.uk-slider-items');

            UI.$win.on("resize load", UI.Utils.debounce(function() {
                $this.resize();
            }, 100));

            this.on("click.uikit.slider", '[data-uk-slider-item]', function(e) {

                e.preventDefault();

                var item = UI.$(this).attr('data-uk-slider-item');

                if ($this.focus == item) return;

                switch(item) {
                    case 'next':
                    case 'previous':
                        $this[item=='next' ? 'next':'previous']();
                        break;
                    default:
                        $this.updateFocus(parseInt(slide, 10));
                }
            });

            this.container.on('touchstart mousedown', function(e) {

                delayIdle = function(e) {

                    dragging = $this;

                    if (e.originalEvent && e.originalEvent.touches) {
                        e = e.originalEvent.touches[0];
                    }

                    dragging.element.data({
                        'pointer-start': {x: parseInt(e.pageX, 10), y: parseInt(e.pageY, 10)},
                        'pointer-pos-start': $this.pos
                    });

                    $this.container.addClass('uk-dragging');

                    delayIdle = false;
                };

                delayIdle.x         = parseInt(e.pageX, 10);
                delayIdle.threshold = $this.options.threshold;

            });

            this.resize();
        },

        resize: function() {

            var $this = this, pos = 0, maxheight = 0, item, width, size;

            this.items = this.container.children();
            this.vp    = this.element[0].getBoundingClientRect().width;

            this.container.css({'min-width': '', 'min-height': ''});

            this.items.each(function(){

                item      = UI.$(this);
                size      = item.css({'left': '', 'width':''})[0].getBoundingClientRect();
                width     = size.width;
                maxheight = Math.max(maxheight, size.height);

                item.css({'left': pos, 'width':width}).data({'left': pos, 'width': width, 'area': (pos+width), 'center':(pos - ($this.vp/2 - width/2))});

                pos += width;
            });

            this.container.css({'min-width': pos, 'min-height': maxheight});

            this.cw = pos;

            this.updateFocus(0);
        },

        updatePos: function(pos) {
            this.pos = pos;
            this.container.css({
                '-ms-transform': 'translateX('+pos+'px)',
                '-webkit-transform': 'translateX('+pos+'px)',
                'transform': 'translateX('+pos+'px)'
            });
        },

        updateFocus: function(idx) {

            var $this = this, ele, item = this.items.eq(idx);

            if (this.options.centered) {

                this.updatePos(item.data('center')*-1);

            } else {

                if (item.data('area') <= this.vp) {
                    this.updatePos(0);
                } else {
                    this.updatePos((item.data('area') - this.vp)*-1);
                }

            }

            this.items.filter('.uk-slider-active').removeClass('uk-slider-active');
            this.items.filter(item).addClass('uk-slider-active');

            this.focus = idx;
        },

        next: function() {

            var focus = this.items[this.focus + 1] ? (this.focus + 1) : this.focus;

            if (!this.options.centered && focus > 0 && this.items.eq(focus).data('area') <= this.vp) {

                for (var i=focus;i<this.items.length;i++) {

                    if (this.items.eq(i).data('area')>this.vp) {
                        focus = i;
                        break;
                    }
                }
            }

            this.updateFocus(focus);
        },

        previous: function() {
            var focus = this.items[this.focus - 1] ? (this.focus - 1) : this.focus;

            if (!this.options.centered && this.items.eq(focus).data('area') <= this.vp) {
                focus = 0;
            }

            this.updateFocus(focus);
        }

    });

    // handle dragging
    UI.$doc.on('mousemove.uikit.slider touchmove.uikit.slider', function(e) {

        if (e.originalEvent && e.originalEvent.touches) {
            e = e.originalEvent.touches[0];
        }

        if (delayIdle && Math.abs(e.pageX - delayIdle.x) > delayIdle.threshold) {
            delayIdle(e);
        }

        if (!dragging) {
            return;
        }

        var x, xDiff, pos;

        if (e.clientX || e.clientY) {
          x = e.clientX;
        } else if (e.pageX || e.pageY) {
          x = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
        }

        xDiff = x - dragging.element.data('pointer-start').x;

        pos = dragging.element.data('pointer-pos-start') + xDiff;

        dragging.updatePos(pos);
    });

    UI.$doc.on('mouseup.uikit.slider touchend.uikit.slider', function(e) {

        if (dragging) {

            dragging.container.removeClass('uk-dragging');

            var direction = dragging.element.data('pointer-pos-start') > dragging.pos ? 1:-1, focus = 0, pos = dragging.pos, item;

            if (dragging.options.centered) {

                if (pos < 0) {

                    pos = Math.abs(dragging.pos);

                    if (pos > dragging.cw - dragging.vp ) {
                        pos = dragging.cw - dragging.vp/2;
                    }

                } else {

                    if (pos < dragging.vp) {
                        pos = 0;
                    }
                }

                for (focus=0;focus<dragging.items.length;focus++) {

                    item = dragging.items.eq(focus);

                    if (item.data('center') > pos) break;
                }

                if (focus>=dragging.items.length) {
                    focus = dragging.items.length-1;
                }

                dragging.updateFocus(focus);

            } else {

                if (pos < 0) {

                    pos = Math.abs(dragging.pos);

                    if (pos > dragging.cw - dragging.vp ) {
                        pos = dragging.cw - dragging.vp;
                    }

                } else {
                    pos = 0;
                }

                if (pos < (dragging.cw - dragging.vp)) {

                    for (focus=0;focus<dragging.items.length;focus++) {
                        if (dragging.items.eq(focus).data('area')>(dragging.vp + pos)) break;
                    }


                    if (direction==-1 && focus > 0) {
                        focus -= 1;
                    }

                    dragging.updateFocus(focus);

                } else if (pos >= (dragging.cw - dragging.vp)) {
                    dragging.updateFocus(dragging.items.length-1);
                }

            }

        }

        dragging = delayIdle = false;
    });

    return UI.slider;
});
