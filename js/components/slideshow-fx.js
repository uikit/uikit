/*! UIkit 2.26.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideshow-fx", ["uikit"], function() {
            return component || addon(UIkit);
        });
    }

})(function(UI) {

    "use strict";

    var Animations = UI.slideshow.animations;

    UI.$.extend(UI.slideshow.animations, {
        'slice': function(current, next, dir, fromfx) {

            if (!current.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var sliceWidth = Math.ceil(this.element.width() / this.options.slices),
                bgimage    = next.data('cover').css('background-image'),
                ghost      = UI.$('<li></li>').css({
                    top    : 0,
                    left   : 0,
                    width  : this.container.width(),
                    height : this.container.height(),
                    opacity: 1,
                    zIndex : 15
                }),
                ghostWidth  = ghost.width(),
                ghostHeight = ghost.height(),
                pos         = fromfx == 'slice-up' ? ghostHeight:'0',
                bar;

            for (var i = 0; i < this.options.slices; i++) {

                if (fromfx == 'slice-up-down') {
                    pos = ((i % 2) + 2) % 2==0 ? '0':ghostHeight;
                }

                var width    = (i == this.options.slices-1) ? sliceWidth : sliceWidth,
                    clipto   = ('rect(0px, '+(width*(i+1))+'px, '+ghostHeight+'px, '+(sliceWidth*i)+'px)'),
                    clipfrom;

                //slice-down - default
                clipfrom = ('rect(0px, '+(width*(i+1))+'px, 0px, '+(sliceWidth*i)+'px)');

                if (fromfx == 'slice-up' || (fromfx == 'slice-up-down' && ((i % 2) + 2) % 2==0 )) {
                    clipfrom = ('rect('+ghostHeight+'px, '+(width*(i+1))+'px, '+ghostHeight+'px, '+(sliceWidth*i)+'px)');
                }

                bar = UI.$('<div class="uk-cover-background"></div>').css({
                    'position'           : 'absolute',
                    'top'                : 0,
                    'left'               : 0,
                    'width'              : ghostWidth,
                    'height'             : ghostHeight,
                    'background-image'   : bgimage,
                    'clip'               : clipfrom,
                    'opacity'            : 0,
                    'transition'         : 'all '+this.options.duration+'ms ease-in-out '+(i*60)+'ms',
                    '-webkit-transition' : 'all '+this.options.duration+'ms ease-in-out '+(i*60)+'ms'

                }).data('clip', clipto);

                ghost.append(bar);
            }

            this.container.append(ghost);

            ghost.children().last().on(UI.support.transition.end, function() {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            ghost.children().each(function() {
                var bar = UI.$(this);

                bar.css({
                    'clip': bar.data('clip'),
                    'opacity': 1
                });
            });

            return d.promise();
        },

        'slice-up': function(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-up']);
        },

        'slice-down': function(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-down']);
        },

        'slice-up-down': function(current, next, dir) {
            return Animations.slice.apply(this, [current, next, dir, 'slice-up-down']);
        },

        'fold': function(current, next, dir) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var sliceWidth = Math.ceil(this.element.width() / this.options.slices),
                bgimage    = next.data('cover').css('background-image'),
                ghost      = UI.$('<li></li>').css({
                    width  : next.width(),
                    height : next.height(),
                    opacity: 1,
                    zIndex : 15
                }),
                ghostWidth  = next.width(),
                ghostHeight = next.height(),
                bar;

            for (var i = 0; i < this.options.slices; i++) {

                bar = UI.$('<div class="uk-cover-background"></div>').css({
                    'position'           : 'absolute',
                    'top'                : 0,
                    'left'               : 0,
                    'width'              : ghostWidth,
                    'height'             : ghostHeight,
                    'background-image'   : bgimage,
                    'transform-origin'   : (sliceWidth*i)+'px 0 0',
                    'clip'               : ('rect(0px, '+(sliceWidth*(i+1))+'px, '+ghostHeight+'px, '+(sliceWidth*i)+'px)'),
                    'opacity'            : 0,
                    'transform'          : 'scaleX(0.000001)',
                    'transition'         : 'all '+this.options.duration+'ms ease-in-out '+(100+i*60)+'ms',
                    '-webkit-transition' : 'all '+this.options.duration+'ms ease-in-out '+(100+i*60)+'ms'
                });

                ghost.prepend(bar);
            }

            this.container.append(ghost);

            ghost.width();

            ghost.children().first().on(UI.support.transition.end, function() {
                ghost.remove();
                d.resolve();
            }).end().css({
                'transform': 'scaleX(1)',
                'opacity': 1
            });

            return d.promise();
        },

        'puzzle': function(current, next, dir) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred(), $this = this;

            var boxCols   = Math.round(this.options.slices/2),
                boxWidth  = Math.round(next.width()/boxCols),
                boxRows   = Math.round(next.height()/boxWidth),
                boxHeight = Math.round(next.height()/boxRows)+1,
                bgimage   = next.data('cover').css('background-image'),
                ghost     = UI.$('<li></li>').css({
                    width   : this.container.width(),
                    height  : this.container.height(),
                    opacity : 1,
                    zIndex  : 15
                }),
                ghostWidth  = this.container.width(),
                ghostHeight = this.container.height(),
                box, rect, width;

            for (var rows = 0; rows < boxRows; rows++) {

                for (var cols = 0; cols < boxCols; cols++) {

                    width  = (cols == boxCols-1) ? (boxWidth + 2) : boxWidth;

                    rect = [
                        (boxHeight * rows)       +'px', // top
                        (width  * (cols+1))      +'px', // right
                        (boxHeight * (rows + 1)) +'px', // bottom
                        (boxWidth  * cols)       +'px'  // left
                    ];

                    box = UI.$('<div class="uk-cover-background"></div>').css({
                        'position'          : 'absolute',
                        'top'               : 0,
                        'left'              : 0,
                        'opacity'           : 0,
                        'width'             : ghostWidth,
                        'height'            : ghostHeight,
                        'background-image'  : bgimage,
                        'clip'              : ('rect('+rect.join(',')+')'),
                        '-webkit-transform' : 'translateZ(0)', // fixes webkit opacity flickering bug
                        'transform'         : 'translateZ(0)'          // fixes moz opacity flickering bug
                    });

                    ghost.append(box);
                }
            }

            this.container.append(ghost);

            var boxes = shuffle(ghost.children());

            boxes.each(function(i) {
                UI.$(this).css({
                    'transition': 'all '+$this.options.duration+'ms ease-in-out '+(50+i*25)+'ms',
                    '-webkit-transition': 'all '+$this.options.duration+'ms ease-in-out '+(50+i*25)+'ms'
                });
            }).last().on(UI.support.transition.end, function() {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            boxes.css({'opacity': 1});

            return d.promise();
        },

        'boxes': function(current, next, dir, fromfx) {

            if (!next.data('cover')) {
                return Animations.fade.apply(this, arguments);
            }

            var d = UI.$.Deferred();

            var boxCols   = Math.round(this.options.slices/2),
                boxWidth  = Math.round(next.width()/boxCols),
                boxRows   = Math.round(next.height()/boxWidth),
                boxHeight = Math.round(next.height()/boxRows)+1,
                bgimage   = next.data('cover').css('background-image'),
                ghost     = UI.$('<li></li>').css({
                    width   : next.width(),
                    height  : next.height(),
                    opacity : 1,
                    zIndex  : 15
                }),
                ghostWidth  = next.width(),
                ghostHeight = next.height(),
                box, rect, width, cols;

            for (var rows = 0; rows < boxRows; rows++) {

                for (cols = 0; cols < boxCols; cols++) {

                    width  = (cols == boxCols-1) ? (boxWidth + 2) : boxWidth;

                    rect = [
                        (boxHeight * rows)       +'px', // top
                        (width  * (cols+1))      +'px', // right
                        (boxHeight * (rows + 1)) +'px', // bottom
                        (boxWidth  * cols)       +'px'  // left
                    ];

                    box = UI.$('<div class="uk-cover-background"></div>').css({
                        'position'          : 'absolute',
                        'top'               : 0,
                        'left'              : 0,
                        'opacity'           : 1,
                        'width'             : ghostWidth,
                        'height'            : ghostHeight,
                        'background-image'  : bgimage,
                        'transform-origin'  : rect[3]+' '+rect[0]+' 0',
                        'clip'              : ('rect('+rect.join(',')+')'),
                        '-webkit-transform' : 'scale(0.0000000000000001)',
                        'transform'         : 'scale(0.0000000000000001)'
                    });

                    ghost.append(box);
                }
            }

            this.container.append(ghost);

            var rowIndex = 0, colIndex = 0, timeBuff = 0, box2Darr = [[]], boxes = ghost.children(), prevCol;

            if (fromfx == 'boxes-reverse') {
                boxes = [].reverse.apply(boxes);
            }

            boxes.each(function() {

                box2Darr[rowIndex][colIndex] = UI.$(this);
                colIndex++;

                if(colIndex == boxCols) {
                    rowIndex++;
                    colIndex = 0;
                    box2Darr[rowIndex] = [];
                }
            });

            for (cols = 0, prevCol = 0; cols < (boxCols * boxRows); cols++) {

                prevCol = cols;

                for (var row = 0; row < boxRows; row++) {

                    if (prevCol >= 0 && prevCol < boxCols) {

                        box2Darr[row][prevCol].css({
                            'transition': 'all '+this.options.duration+'ms linear '+(50+timeBuff)+'ms',
                            '-webkit-transition': 'all '+this.options.duration+'ms linear '+(50+timeBuff)+'ms'
                        });
                    }
                    prevCol--;
                }
                timeBuff += 100;
            }

            boxes.last().on(UI.support.transition.end, function() {
                ghost.remove();
                d.resolve();
            });

            ghost.width();

            boxes.css({
                '-webkit-transform': 'scale(1)',
                'transform': 'scale(1)'
            });

            return d.promise();
        },

        'boxes-reverse': function(current, next, dir) {
            return Animations.boxes.apply(this, [current, next, dir, 'boxes-reverse']);
        },

        'random-fx': function(){

            var animations = ['slice-up', 'fold', 'puzzle', 'slice-down', 'boxes', 'slice-up-down', 'boxes-reverse'];

            this.fxIndex = (this.fxIndex === undefined ? -1 : this.fxIndex) + 1;

            if (!animations[this.fxIndex]) this.fxIndex = 0;

            return Animations[animations[this.fxIndex]].apply(this, arguments);
        }
    });


    // helper functions

    // Shuffle an array
    var shuffle = function(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
        return arr;
    };

    return UI.slideshow.animations;
});
