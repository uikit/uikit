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

    var supportsTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
    var supportsDragAndDrop = !supportsTouch && (function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    })();

    var CHILD_CLASS    = "uk-sortable-child";
    var DRAGGING_CLASS = "uk-sortable-dragging";
    var OVER_CLASS     = "uk-sortable-over";

    function hasClassName(el, name) {
        return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(el.className);
    }

    function addClassName (el, name) {
        if (!hasClassName(el, name)) {
          el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    function removeClassName(el, name) {
        if (hasClassName(el, name)) {
          var c = el.className;
          el.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), " ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
    }

    function moveElementNextTo(element, elementToMoveNextTo) {
        if (isBelow(element, elementToMoveNextTo)) {
            // Insert element before to elementToMoveNextTo.
            elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo);
        }
        else {
            // Insert element after to elementToMoveNextTo.
            elementToMoveNextTo.parentNode.insertBefore(element, elementToMoveNextTo.nextSibling);
        }
    }

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

    function dragenterData(element, val) {
        if (arguments.length == 1) {
            return parseInt(element.getAttribute("data-child-dragenter"), 10) || 0;
        }
        else if (!val) {
            element.removeAttribute("data-child-dragenter");
        }
        else {
            element.setAttribute("data-child-dragenter", Math.max(0, val));
        }
    }


    UI.component('sortable', {

        defaults: {
            warp: false,
            stop: function() {},
            start: function() {},
            change: function() {}
        },

        init: function() {

            var opts = this.options, element = this.element[0];

            var warp = !!opts.warp;
            var stop = opts.stop || function() { };
            var start = opts.start || function() { };
            var change = opts.change || function() { };

            var currentlyDraggingElement = null;
            var currentlyDraggingTarget = null;

            var handleDragStart = delegate(function(e) {
                if (supportsTouch) {
                    prevent(e);
                }

                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'moving';
                    e.dataTransfer.setData('Text', "*"); // Need to set to something or else drag doesn't start
                }

                currentlyDraggingElement = this;
                addClassName(currentlyDraggingElement, DRAGGING_CLASS);

                [].forEach.call(element.childNodes, function(el) {
                    if (el.nodeType === 1) {
                        addClassName(el, CHILD_CLASS);
                    }
                });


                addFakeDragHandlers();
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

            var handleDragEnter = delegate(function(e) {

                if (!currentlyDraggingElement || currentlyDraggingElement === this) {
                    return true;
                }

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = dragenterData(this);
                dragenterData(this, previousCounter + 1);

                if (previousCounter === 0) {

                    addClassName(this, OVER_CLASS);

                    if (!warp) {
                        moveElementNextTo(currentlyDraggingElement, this);
                    }
                }

                return false;
            });

            var handleDragLeave = delegate(function(e) {

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = dragenterData(this);
                dragenterData(this, previousCounter - 1);

                // This is a fix for child elements firing dragenter before the parent fires dragleave
                if (!dragenterData(this)) {
                    removeClassName(this, OVER_CLASS);
                    dragenterData(this, false);
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
                if (this === currentlyDraggingElement) {
                    return;
                }

                if (warp) {
                    var thisSibling = currentlyDraggingElement.nextSibling;
                    this.parentNode.insertBefore(currentlyDraggingElement, this);
                    this.parentNode.insertBefore(this, thisSibling);
                }

                change(this, currentlyDraggingElement);
            });

            var handleDragEnd = function(e) {

                currentlyDraggingElement = null;
                currentlyDraggingTarget = null;
                [].forEach.call(element.childNodes, function(el) {
                    if (el.nodeType === 1) {
                        removeClassName(el, OVER_CLASS);
                        removeClassName(el, DRAGGING_CLASS);
                        removeClassName(el, CHILD_CLASS);
                        dragenterData(el, false);
                    }
                });

                removeFakeDragHandlers();
            };

            var handleTouchMove = delegate(function(e) {

                if (!currentlyDraggingElement ||
                    currentlyDraggingElement === this ||
                    currentlyDraggingTarget === this) {
                    return true;
                }

                [].forEach.call(element.childNodes, function(el) {
                    removeClassName(el, OVER_CLASS);
                });

                currentlyDraggingTarget = this;

                if (!warp) {
                    moveElementNextTo(currentlyDraggingElement, this);
                }
                else {
                    addClassName(this, OVER_CLASS);
                }

                return prevent(e);
            });

            function delegate(fn) {
                return function(e) {
                    var touch = (supportsTouch && e.touches && e.touches[0]) || { };
                    var target = touch.target || e.target;

                    // Fix event.target for a touch event
                    if (supportsTouch && document.elementFromPoint) {
                        target = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop);
                    }

                    if (hasClassName(target, CHILD_CLASS)) {
                        fn.apply(target, [e]);
                    }
                    else if (target !== element) {

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
                    }
                    else {
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
                    }
                    else {
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
            }
            else {
                if (supportsTouch) {
                    element.addEventListener('touchstart', handleDragStart, false);
                }
                else {
                    element.addEventListener('mousedown', handleDragStart, false);
                }
            }

            [].forEach.call(element.childNodes, function(el) {
                if (el.nodeType === 1) {
                    el.setAttribute("draggable", "true");
                }
            });
        }
    });

    $(document).on("uk-domready", function(e) {

        $("[data-uk-sortable]").each(function(){

          var ele = $(this);

          if(!ele.data("sortable")) {
              var plugin = UI.sortable(ele, UI.Utils.options(ele.attr("data-uk-sortable")));
          }
        });
    });

    return UI.sortable;
});