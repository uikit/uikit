/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-grid', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    UI.component('grid', {

        defaults: {
            colwidth  : 'auto',
            animation : true,
            duration  : 300,
            gutter    : 0,
            controls  : false,
            filter    : false,
            origin    : UI.langdirection
        },

        boot:  function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid]', context).each(function(){

                    var ele = UI.$(this);

                    if(!ele.data('grid')) {
                        UI.grid(ele, UI.Utils.options(ele.attr('data-uk-grid')));
                    }
                });
            });
        },

        init: function() {

            var $this = this, gutter = String(this.options.gutter).trim().split(' ');

            this.gutterv  = parseInt(gutter[0], 10);
            this.gutterh  = parseInt((gutter[1] || gutter[0]), 10);

            // make sure parent element has the right position property
            this.element.css({'position': 'relative'});

            this.controls = null;
            this.origin   = this.options.origin;

            if (this.options.controls) {

                this.controls = UI.$(this.options.controls);

                // filter
                this.controls.on('click', '[data-uk-filter]', function(e){
                    e.preventDefault();
                    $this.filter(UI.$(this).attr('data-uk-filter'));
                });

                // sort
                this.controls.on('click', '[data-uk-sort]', function(e){
                    e.preventDefault();
                    var cmd = UI.$(this).attr('data-uk-sort').split(':');
                    $this.sort(cmd[0], cmd[1]);
                });
            }

            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(){

                if ($this.currentfilter) {
                    $this.filter($this.currentfilter);
                } else {
                    this.update();
                }

            }.bind(this), 100));

            this.on('display.uk.check', function(){
                if ($this.element.is(':visible'))  $this.update();
            });

            UI.domObserve(this.element, function(e) {
                $this.update();
            });

            if (this.options.filter !== false) {
                this.filter(this.options.filter);
            } else {
                this.update();
            }
        },

        _prepareElements: function() {

            var children = this.element.children().not('[data-grid-prepared]'), css;

            // exit if no already prepared elements found
            if (!children.length) {
                return;
            }

            css = {
                position  : 'absolute',
                boxSizing : 'border-box',
                width     : this.options.colwidth == 'auto' ? '' : this.options.colwidth
            };

            if (this.options.gutter) {

                css['padding-'+this.origin] = this.gutterh;
                css['padding-bottom'] = this.gutterv;

                this.element.css('margin-'+this.origin, this.gutterh * -1);
            }

            children.attr('data-grid-prepared', 'true').css(css);
        },

        update: function(elements) {

            var $this = this;

            this._prepareElements();

            elements = elements || this.element.children(':visible');

            var children  = elements,
                maxwidth  = this.element.width() + (2*this.gutterh) + 2,
                left      = 0,
                top       = 0,
                positions = [],

                item, width, height, pos, posi, i, z, max, size;

            this.trigger('beforeupdate.uk.grid', [children]);

            children.each(function(index){

                item   = UI.$(this);
                size   = this.getBoundingClientRect();
                width  = size.width;
                height = size.height;
                left   = 0;
                top    = 0;

                for (i=0,max=positions.length;i<max;i++) {

                    pos = positions[i];

                    if (left <= pos.aX) { left = pos.aX; }
                    if (maxwidth < (left + width)) { left = 0; }
                    if (top <= pos.aY) { top = pos.aY; }
                }

                posi = {
                    ele    : item,
                    top    : top,
                    width  : width,
                    height : height,
                    aY     : (top  + height),
                    aX     : (left + width)
                };

                posi[$this.origin] = left;

                positions.push(posi);
            });

            var posPrev, maxHeight = 0, positionto;

            // fix top
            for (i=0,max=positions.length;i<max;i++) {

                pos = positions[i];
                top = 0;

                for (z=0;z<i;z++) {

                    posPrev = positions[z];

                    // (posPrev.left + 1) fixex 1px bug when using % based widths
                    if (pos[this.origin] < posPrev.aX && (posPrev[this.origin] +1) < pos.aX) {
                        top = posPrev.aY;
                    }
                }

                pos.top = top;
                pos.aY  = top + pos.height;

                maxHeight = Math.max(maxHeight, pos.aY);
            }

            maxHeight = maxHeight - this.gutterv;

            if (this.options.animation) {

                this.element.stop().animate({'height': maxHeight}, 100);

                positions.forEach(function(pos){

                    positionto = {"top": pos.top, opacity: 1};
                    positionto[$this.origin] = pos[$this.origin];

                    pos.ele.stop().animate(positionto, this.options.duration);
                }.bind(this));

            } else {

                this.element.css('height', maxHeight);

                positions.forEach(function(pos){
                    positionto = {"top": pos.top, opacity: 1};
                    positionto[$this.origin] = pos[$this.origin];
                    pos.ele.css(positionto);
                }.bind(this));
            }

            // make sure to trigger possible scrollpies etc.
            setTimeout(function() {
                UI.$doc.trigger('scrolling.uk.document');
            }, 2 * this.options.duration * (this.options.animation ? 1:0));

            this.trigger('afterupdate.uk.grid', [children]);
        },

        filter: function(filter) {

            this.currentfilter = filter;

            filter = filter || [];

            if (typeof(filter) === 'number') {
                filter = filter.toString();
            }

            if (typeof(filter) === 'string') {
                filter = filter.split(/,/).map(function(item){ return item.trim(); });
            }

            var $this = this, children = this.element.children(), elements = {"visible": [], "hidden": []}, visible, hidden;

            children.each(function(index){

                var ele = UI.$(this), f = ele.attr('data-uk-filter'), infilter = filter.length ? false : true;

                if (f) {

                    f = f.split(/,/).map(function(item){ return item.trim(); });

                    filter.forEach(function(item){
                        if (f.indexOf(item) > -1) infilter = true;
                    });
                }

                elements[infilter ? "visible":"hidden"].push(ele);
            });

            // convert to jQuery collections
            elements.hidden  = UI.$(elements.hidden).map(function () {return this[0];});
            elements.visible = UI.$(elements.visible).map(function () {return this[0];});

            elements.hidden.attr('aria-hidden', 'true').filter(':visible').fadeOut(this.options.duration);
            elements.visible.attr('aria-hidden', 'false').filter(':hidden').css('opacity', 0).show();

            $this.update(elements.visible);

            if (this.controls && this.controls.length) {
                this.controls.find('[data-uk-filter]').removeClass('uk-active').filter('[data-uk-filter="'+filter+'"]').addClass('uk-active');
            }
        },

        sort: function(by, order){

            order = order || 1;

            // covert from string (asc|desc) to number
            if (typeof(order) === 'string') {
                order = order.toLowerCase() == 'desc' ? -1 : 1;
            }

            var elements = this.element.children();

            elements.sort(function(a, b){

                a = UI.$(a);
                b = UI.$(b);

                return (b.data(by) || '') < (a.data(by) || '') ? order : (order*-1);

            }).appendTo(this.element);

            this.update(elements.filter(':visible'));

            if (this.controls && this.controls.length) {
                this.controls.find('[data-uk-sort]').removeClass('uk-active').filter('[data-uk-sort="'+by+':'+(order == -1 ? 'desc':'asc')+'"]').addClass('uk-active');
            }
        }
    });

});
