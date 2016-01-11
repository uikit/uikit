"use strict";

import $ from './dom';

export default {

    extend(out) {

        out = out || {};

        for (let i = 1; i < arguments.length; i++) {

            let obj = arguments[i];

            if (!obj) continue;

            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        this.extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    },

    type() {
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
    },

    uuid() {

        let rs = function() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };

        return [rs(),rs(),rs(),rs(),rs(),rs(),rs(),rs()].join('-');
    },

    isFullscreen() {
        return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
    },

    str2json(str) {
        try {
            return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
        } catch(e) { return false; }
    },

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    isInView(element, options) {

        let $element = $(element),
            $win = $(window);

        if (!$element.is(':visible')) {
            return false;
        }

        let window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
            return true;
        } else {
            return false;
        }
    },

    attributes(element) {

        element = element[0] || element;

        let attributes = {};

        for (let val,i=0;i<element.attributes.length;i++) {

            val = this.str2json(element.attributes[i].value);
            attributes[element.attributes[i].name] = val===false && element.attributes[i].value!='false' ? element.attributes[i].value:val;
        }

        return attributes;
    },

    matchHeights(elements, options) {

        elements = $(elements).css('min-height', '');
        options  = $.extend({ row : true }, options);

        let matchHeights = function(group){

            if (group.length < 2) return;

            let max = 0;

            group.each(function() {
                max = Math.max(max, $(this).outerHeight());
            }).each(function() {

                let element = $(this),
                    height  = max - (element.css('box-sizing') == 'border-box' ? 0 : (element.outerHeight() - element.height()));

                element.css('min-height', height + 'px');
            });
        };

        if (options.row) {

            elements.first().width(); // force redraw

            setTimeout(function(){

                let lastoffset = false, group = [];

                elements.each(function() {

                    let ele = $(this), offset = ele.offset().top;

                    if (offset != lastoffset && group.length) {

                        matchHeights($(group));
                        group  = [];
                        offset = ele.offset().top;
                    }

                    group.push(ele);
                    lastoffset = offset;
                });

                if (group.length) {
                    matchHeights($(group));
                }

            }, 0);

        } else {
            matchHeights(elements);
        }
    },

    stackMargin(elements, options) {

        options = $.extend({
            'cls': 'uk-margin-small-top'
        }, options);

        options.cls = options.cls;

        elements = $(elements).removeClass(options.cls);

        var skip         = false,
            firstvisible = elements.filter(":visible:first"),
            offset       = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

        if (offset === false || elements.length == 1) return;

        elements.each(function() {

            var column = $(this);

            if (column.is(":visible")) {

                if (skip) {
                    column.addClass(options.cls);
                } else {

                    if (column.position().top >= offset) {
                        skip = column.addClass(options.cls);
                    }
                }
            }
        });
    }

};
