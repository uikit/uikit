/*! UIkit 2.10.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

/*
  * Based on nativesortable - Copyright (c) Brian Grinstead - https://github.com/bgrins/nativesortable
  */
(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sortable", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    "use strict";

    var supportsTouch       = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
        supportsDragAndDrop = !supportsTouch && (function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    })(),

    draggingPlaceholder, moving, dragging, clickedlink, delayIdle;

    // disable native dragndrop support for now
    supportsDragAndDrop = false;

    UI.component('sortable', {

        defaults: {

            warp             : false,
            animation        : 150,
            threshold        : 10,

            childClass       : 'uk-sortable-item',
            placeholderClass : 'uk-sortable-placeholder',
            overClass        : 'uk-sortable-over',
            draggingClass    : 'uk-sortable-dragged',
            dragMovingClass  : 'uk-sortable-moving',
            dragCustomClass  : '',
            handleClass      : false,

            stop             : function() {},
            start            : function() {},
            change           : function() {}
        },

        init: function() {

            var $this                    = this,
                element                  = this.element[0],
                currentlyDraggingElement = null,
                currentlyDraggingTarget  = null,
                children;

            if (supportsDragAndDrop) {
                this.element.children().attr("draggable", "true");

            } else {

                // prevent leaving page after link clicking
                // prevent leaving page after link clicking
                this.element.on('mousedown touchstart', 'a[href]', function(e) {
                    // don't break browser shortcuts for click+open in new tab
                    if(!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        clickedlink = $(this);
                    }
                }).on('click', 'a[href]', function(e) {
                    if(!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        clickedlink = $(this);
                        e.stopImmediatePropagation();
                        return false;
                    }
                });
            }

            var handleDragStart = delegate(function(e) {

                moving = false;
                dragging = false;

                var target = $(e.target), children = $this.element.children();

                if (!supportsTouch && e.button==2) {
                    return;
                }

                if ($this.options.handleClass) {

                    var handle = target.hasClass($this.options.handleClass) ? target : target.closest('.'+$this.options.handleClass, element);

                    if (!handle.length) {
                        //e.preventDefault();
                        return;
                    }
                }

                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.dropEffect = 'move';
                    e.dataTransfer.setData('Text', "*"); // Need to set to something or else drag doesn't start
                }

                currentlyDraggingElement = this;

                // init drag placeholder
                if (draggingPlaceholder) draggingPlaceholder.remove();

                var $current = $(currentlyDraggingElement), offset = $current.offset();

                delayIdle = {

                    pos       : { x:e.pageX, y:e.pageY },
                    threshold : $this.options.threshold,
                    'apply'   : function() {

                        draggingPlaceholder = $('<div class="'+([$this.options.draggingClass, $this.options.dragCustomClass].join(' '))+'"></div>').css({
                            display : 'none',
                            top     : offset.top,
                            left    : offset.left,
                            width   : $current.width(),
                            height  : $current.height(),
                            padding : $current.css('padding')
                        }).data('mouse-offset', {
                            'left': offset.left - parseInt(e.pageX, 10),
                            'top' : offset.top  - parseInt(e.pageY, 10)
                        }).append($current.html()).appendTo('body');

                        draggingPlaceholder.$current  = $current;
                        draggingPlaceholder.$sortable = $this;

                        addFakeDragHandlers();

                        $this.options.start(this, currentlyDraggingElement);
                        $this.trigger('sortable-start', [$this, currentlyDraggingElement]);

                        delayIdle = false;
                    }
                }

                if (!supportsDragAndDrop) {
                    e.preventDefault();
                }
            });

            var handleDragOver = delegate(function(e) {

                if (!currentlyDraggingElement) {
                    return true;
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }

                return false;
            });

            var handleDragEnter = delegate($.UIkit.Utils.debounce(function(e) {

                if (!currentlyDraggingElement || currentlyDraggingElement === this) {
                    return true;
                }

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = $this.dragenterData(this);

                $this.dragenterData(this, previousCounter + 1);

                if (previousCounter === 0) {

                    $(this).addClass($this.options.overClass);

                    if (!$this.options.warp) {
                        $this.moveElementNextTo(currentlyDraggingElement, this);
                    }
                }

                return false;
            }), 40);

            var handleDragLeave = delegate(function(e) {

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = $this.dragenterData(this);
                $this.dragenterData(this, previousCounter - 1);

                // This is a fix for child elements firing dragenter before the parent fires dragleave
                if (!$this.dragenterData(this)) {
                    $(this).removeClass($this.options.overClass);
                    $this.dragenterData(this, false);
                }
            });

            var handleDrop = delegate(function(e) {


                if (e.type === 'drop') {

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }

                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                }

                if (!dragging) {
                    return;
                }

                if ($this.options.warp) {
                    var thisSibling = currentlyDraggingElement.nextSibling;
                    this.parentNode.insertBefore(currentlyDraggingElement, this);
                    this.parentNode.insertBefore(this, thisSibling);
                }

                $this.options.change(this, currentlyDraggingElement);
                $this.trigger('sortable-change', [$this, currentlyDraggingElement]);
            });

            var handleDragEnd = function(e) {

                currentlyDraggingElement = null;
                currentlyDraggingTarget  = null;

                $this.element.children().each(function() {
                    if (this.nodeType === 1) {
                        $(this).removeClass($this.options.overClass).removeClass($this.options.placeholderClass).removeClass($this.options.childClass);
                        $this.dragenterData(this, false);
                    }
                });

                $('html').removeClass($this.options.dragMovingClass);

                removeFakeDragHandlers();

                $this.options.stop(this);
                $this.trigger('sortable-stop', [$this]);

                draggingPlaceholder.remove();
                draggingPlaceholder = null;
            };

            var handleTouchMove = delegate(function(e) {

                if (!currentlyDraggingElement ||
                    currentlyDraggingElement === this ||
                    currentlyDraggingTarget === this) {
                    return true;
                }

                children.removeClass($this.options.overClass);
                currentlyDraggingTarget = this;

                if (!$this.options.warp) {
                    $this.moveElementNextTo(currentlyDraggingElement, this);
                } else {
                    $(this).addClass($this.options.overClass);
                }

                return prevent(e);
            });

            function delegate(fn) {
                return function(e) {

                    var touch  = (supportsTouch && e.touches && e.touches[0]) || { },
                        target = touch.target || e.target;

                    // Fix event.target for a touch event
                    if (supportsTouch && document.elementFromPoint) {
                        target = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop);
                    }

                    if ($(target).hasClass($this.options.childClass)) {
                        fn.apply(target, [e]);
                    } else if (target !== element) {

                        // If a child is initiating the event or ending it, then use the container as context for the callback.
                        var context = moveUpToChildNode(element, target);

                        if (context) {
                            fn.apply(context, [e]);
                        }
                    }
                };
            }

            // Opera and mobile devices do not support drag and drop.  http://caniuse.com/dragndrop
            // Bind/unbind standard mouse/touch events as a polyfill.
            function addFakeDragHandlers() {
                if (!supportsDragAndDrop) {
                    if (supportsTouch) {
                        element.addEventListener("touchmove", handleTouchMove, false);
                    } else {
                        element.addEventListener('mouseover', handleDragEnter, false);
                        element.addEventListener('mouseout', handleDragLeave, false);
                    }

                    element.addEventListener(supportsTouch ? 'touchend' : 'mouseup', handleDrop, false);
                    document.addEventListener(supportsTouch ? 'touchend' : 'mouseup', handleDragEnd, false);
                    document.addEventListener("selectstart", prevent, false);

                }
            }

            function removeFakeDragHandlers() {
                if (!supportsDragAndDrop) {
                    if (supportsTouch) {
                        element.removeEventListener("touchmove", handleTouchMove, false);
                    } else {
                        element.removeEventListener('mouseover', handleDragEnter, false);
                        element.removeEventListener('mouseout', handleDragLeave, false);
                    }

                    element.removeEventListener(supportsTouch ? 'touchend' : 'mouseup', handleDrop, false);
                    document.removeEventListener(supportsTouch ? 'touchend' : 'mouseup', handleDragEnd, false);
                    document.removeEventListener("selectstart", prevent, false);
                }
            }

            if (supportsDragAndDrop) {
                element.addEventListener('dragstart', handleDragStart, false);
                element.addEventListener('dragenter', handleDragEnter, false);
                element.addEventListener('dragleave', handleDragLeave, false);
                element.addEventListener('drop', handleDrop, false);
                element.addEventListener('dragover', handleDragOver, false);
                element.addEventListener('dragend', handleDragEnd, false);
            } else {

                element.addEventListener(supportsTouch ? 'touchstart':'mousedown', handleDragStart, false);
            }
        },

        dragenterData: function(element, val) {

            element = $(element);

            if (arguments.length == 1) {
                return parseInt(element.attr('data-child-dragenter'), 10) || 0;
            } else if (!val) {
                element.removeAttr('data-child-dragenter');
            } else {
                element.attr('data-child-dragenter', Math.max(0, val));
            }
        },

        moveElementNextTo: function(element, elementToMoveNextTo) {

            dragging = true;

            var $this    = this,
                list     = $(element).parent().css('min-height', ''),
                next     = isBelow(element, elementToMoveNextTo) ? elementToMoveNextTo : elementToMoveNextTo.nextSibling,
                children = list.children(),
                count    = children.length;

            if($this.options.warp || !$this.options.animation) {
                elementToMoveNextTo.parentNode.insertBefore(element, next);
                UI.Utils.checkDisplay($this.element);
                return;
            }

            list.css('min-height', list.height());

            children.stop().each(function(){
                var ele = $(this),
                    offset = ele.position();

                    offset.width = ele.width();

                ele.data('offset-before', offset);
            });

            elementToMoveNextTo.parentNode.insertBefore(element, next);

            children = list.children().each(function() {
                var ele    = $(this);
                ele.data('offset-after', ele.position());
            }).each(function() {
                var ele    = $(this),
                    before = ele.data('offset-before');
                ele.css({'position':'absolute', 'top':before.top, 'left':before.left, 'min-width':before.width });
            });

            children.each(function(){

                var ele    = $(this),
                    before = ele.data('offset-before'),
                    offset = ele.data('offset-after');

                    ele.css('pointer-events', 'none').width();

                    setTimeout(function(){
                        ele.animate({'top':offset.top, 'left':offset.left}, $this.options.animation, function() {
                            ele.css({'position':'','top':'', 'left':'', 'min-width': '', 'pointer-events':''}).removeClass($this.options.overClass).attr('data-child-dragenter', '');
                            count--
                            if (!count) {
                                list.css('min-height', '');
                                UI.Utils.checkDisplay(ele);
                            }
                        });
                    }, 0);
            });


        }
    });

    // helpers

    function isBelow(el1, el2) {

        var parent = el1.parentNode;

        if (el2.parentNode != parent) {
            return false;
        }

        var cur = el1.previousSibling;

        while (cur && cur.nodeType !== 9) {
            if (cur === el2) {
                return true;
            }
            cur = cur.previousSibling;
        }

        return false;
    }

    function moveUpToChildNode(parent, child) {
        var cur = child;
        if (cur == parent) { return null; }

        while (cur) {
            if (cur.parentNode === parent) {
                return cur;
            }

            cur = cur.parentNode;
            if ( !cur || !cur.ownerDocument || cur.nodeType === 11 ) {
                break;
            }
        }
        return null;
    }

    function prevent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    // auto init
    UI.ready(function(context) {

        $("[data-uk-sortable]", context).each(function(){

          var ele = $(this);

          if(!ele.data("sortable")) {
              var plugin = UI.sortable(ele, UI.Utils.options(ele.attr("data-uk-sortable")));
          }
        });
    });

    UI.$doc.on('mousemove touchmove', function(e) {

        if (delayIdle) {
            if (Math.abs(e.pageX - delayIdle.pos.x) > delayIdle.threshold || Math.abs(e.pageY - delayIdle.pos.y) > delayIdle.threshold) {
                delayIdle.apply();
            }
        }

        if (draggingPlaceholder) {

            if (!moving) {
                moving = true;
                draggingPlaceholder.show();

                draggingPlaceholder.$current.addClass(draggingPlaceholder.$sortable.options.placeholderClass);
                draggingPlaceholder.$sortable.element.children().addClass(draggingPlaceholder.$sortable.options.childClass);

                $('html').addClass(draggingPlaceholder.$sortable.options.dragMovingClass);
            }

            var offset = draggingPlaceholder.data('mouse-offset'),
                left   = parseInt(e.originalEvent.pageX, 10) + offset.left,
                top    = parseInt(e.originalEvent.pageY, 10) + offset.top;

            draggingPlaceholder.css({'left': left, 'top': top });
        }
    });

    UI.$doc.on('mouseup touchend', function() {

        if(!moving && clickedlink) {
            location.href = clickedlink.attr('href');
        }

        delayIdle = clickedlink = false;
    });

    return UI.sortable;
});
