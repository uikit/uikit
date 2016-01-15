import $ from 'jquery';
import {str2json, extend} from './lang';


export function attributes(element) {

    element = element[0] || element;

    let attributes = {};

    for (let val,i=0;i<element.attributes.length;i++) {

        val = str2json(element.attributes[i].value);
        attributes[element.attributes[i].name] = val===false && element.attributes[i].value!='false' ? element.attributes[i].value:val;
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

    options = extend({topoffset:0, leftoffset:0}, options);

    if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
        left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
        return true;
    } else {
        return false;
    }
}

export function matchHeights(elements, options) {

    elements = $(elements).css('min-height', '');
    options  = extend({ row : true }, options);

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
}

export function stackMargin(elements, options) {

    options = extend({
        margin: 'uk-margin-small-top'
    }, options);

    options.margin = options.margin;

    elements = $(elements).removeClass(options.margin);

    let skip         = false,
        firstvisible = elements.filter(":visible:first"),
        offset       = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

    if (offset === false || elements.length == 1) return;

    elements.each(function() {

        let column = $(this);

        if (column.is(":visible")) {

            if (skip) {
                column.addClass(options.margin);
            } else {

                if (column.position().top >= offset) {
                    skip = column.addClass(options.margin);
                }
            }
        }
    });
}

export function checkDisplay(context, initanimation) {

    let elements = $('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]', context || document), animated;

    if (context && !elements.length) {
        elements = $(context);
    }

    elements.trigger('display.uk.check');

    // fix firefox / IE animations
    if (initanimation) {

        if (typeof(initanimation)!='string') {
            initanimation = '[class*="uk-animation-"]';
        }

        elements.find(initanimation).each(function(){

            let ele  = $(this),
                cls  = ele.attr('class'),
                anim = cls.match(/uk\-animation\-(.+)/);

            ele.removeClass(anim[0]).width();

            ele.addClass(anim[0]);
        });
    }

    return elements;
}
