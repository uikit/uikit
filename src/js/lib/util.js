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

    isFullscreen() {
        return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
    },

    str2json(str) {
        try {
            return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
        } catch(e) { return false; }
    },

    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    isInView(element, options) {

        var $element = $(element),
            $win = $(window);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

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
    }

};
