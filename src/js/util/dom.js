import $ from 'jquery';
import {str2json, extend} from './lang';
import {hasAnimation} from './env';

export function attributes(element) {

    element = element[0] || element;

    let attributes = {};

    for (let val, i = 0; i < element.attributes.length; i++) {

        val = str2json(element.attributes[i].value);
        attributes[element.attributes[i].name] = val === false && element.attributes[i].value != 'false' ? element.attributes[i].value : val;
    }

    return attributes;
}

export function isFullscreen() {
    return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
}

export function isInView(element, options) {

    let $element = $(element),
        $win = $(window);

    if (!$element.is(':visible')) {
        return false;
    }

    let window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

    options = extend({topoffset: 0, leftoffset: 0}, options);

    return !!(top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
    left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width());
}

export function animate(element, cls) {

    var d = $.Deferred();

    element = $(element);

    if (hasAnimation) {

        element.css('display', 'none').addClass(cls).one(hasAnimation.end, function () {
            element.removeClass(cls);
            d.resolve();
        });

        element.css('display', '');
    } else {
        d.resolve();
    }

    return d.promise();
}

export function ready(fn) {

    var handle = function () {
        document.removeEventListener('DOMContentLoaded', handle);
        window.removeEventListener('load', handle);
        fn();
    };

    if (document.readyState === 'complete') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', handle);
        window.addEventListener('load', handle);
    }

}
