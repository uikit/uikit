/*! UIkit 2.26.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
 * Based on Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-nestable", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI) {

    "use strict";

    var hasTouch     = 'ontouchstart' in window,
        html         = UI.$html,
        touchedlists = [],
        $win         = UI.$win,
        draggingElement;

    var eStart  = hasTouch ? 'touchstart'  : 'mousedown',
        eMove   = hasTouch ? 'touchmove'   : 'mousemove',
        eEnd    = hasTouch ? 'touchend'    : 'mouseup',
        eCancel = hasTouch ? 'touchcancel' : 'mouseup';


    UI.component('nestable', {

        defaults: {
            listBaseClass   : 'uk-nestable',
            listClass       : 'uk-nestable-list',
            listItemClass   : 'uk-nestable-item',
            dragClass       : 'uk-nestable-dragged',
            movingClass     : 'uk-nestable-moving',
            noChildrenClass : 'uk-nestable-nochildren',
            emptyClass      : 'uk-nestable-empty',
            handleClass     : '',
            collapsedClass  : 'uk-collapsed',
            placeholderClass: 'uk-nestable-placeholder',
            noDragClass     : 'uk-nestable-nodrag',
            group           : false,
            maxDepth        : 10,
            threshold       : 20,
            idlethreshold   : 10,
        },

        boot: function() {

            // adjust document scrolling
            UI.$html.on('mousemove touchmove', function(e) {

                if (draggingElement) {

                    var top = draggingElement.offset().top;

                    if (top < UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() - Math.ceil(draggingElement.height()/2));
                    } else if ( (top + draggingElement.height()) > (window.innerHeight + UI.$win.scrollTop()) ) {
                        UI.$win.scrollTop(UI.$win.scrollTop() + Math.ceil(draggingElement.height()/2));
                    }
                }
            });

            // init code
            UI.ready(function(context) {

                UI.$("[data-uk-nestable]", context).each(function(){

                    var ele = UI.$(this);

                    if (!ele.data("nestable")) {
                        UI.nestable(ele, UI.Utils.options(ele.attr("data-uk-nestable")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            Object.keys(this.options).forEach(function(key){

                if(String(key).indexOf('Class')!=-1) {
                    $this.options['_'+key] = '.' + $this.options[key];
                }
            });

            this.find(this.options._listItemClass).find(">ul").addClass(this.options.listClass);

            this.checkEmptyList();

            this.reset();
            this.element.data('nestable-group', this.options.group || UI.Utils.uid('nestable-group'));

            this.find(this.options._listItemClass).each(function() {
                $this.setParent(UI.$(this));
            });

            this.on('click', '[data-nestable-action]', function(e) {

                if ($this.dragEl || (!hasTouch && e.button !== 0)) {
                    return;
                }

                e.preventDefault();

                var target = UI.$(e.currentTarget),
                    action = target.data('nestableAction'),
                    item   = target.closest($this.options._listItemClass);

                if (action === 'collapse') {
                    $this.collapseItem(item);
                }
                if (action === 'expand') {
                    $this.expandItem(item);
                }
                if (action === 'toggle') {
                    $this.toggleItem(item);
                }
            });

            var onStartEvent = function(e) {

                var handle = UI.$(e.target);

                if (e.target === $this.element[0]) {
                    return;
                }

                if (handle.is($this.options._noDragClass) || handle.closest($this.options._noDragClass).length) {
                    return;
                }

                if (handle.is('[data-nestable-action]') || handle.closest('[data-nestable-action]').length) {
                    return;
                }

                if ($this.options.handleClass && !handle.hasClass($this.options.handleClass)) {

                    if ($this.options.handleClass) {
                        handle = handle.closest($this.options._handleClass);
                    }
                }

                if (!handle.length || $this.dragEl || (!hasTouch && e.button !== 0) || (hasTouch && e.touches.length !== 1)) {
                    return;
                }

                if (e.originalEvent && e.originalEvent.touches) {
                    e = evt.originalEvent.touches[0];
                }

                $this.delayMove = function(evt) {

                    evt.preventDefault();
                    $this.dragStart(e);
                    $this.trigger('start.uk.nestable', [$this]);

                    $this.delayMove = false;
                };

                $this.delayMove.x         = parseInt(e.pageX, 10);
                $this.delayMove.y         = parseInt(e.pageY, 10);
                $this.delayMove.threshold = $this.options.idlethreshold;

                e.preventDefault();
            };

            var onMoveEvent = function(e) {

                if (e.originalEvent && e.originalEvent.touches) {
                    e = e.originalEvent.touches[0];
                }

                if ($this.delayMove && (Math.abs(e.pageX - $this.delayMove.x) > $this.delayMove.threshold || Math.abs(e.pageY - $this.delayMove.y) > $this.delayMove.threshold)) {

                    if (!window.getSelection().toString()) {
                        $this.delayMove(e);
                    } else {
                        $this.delayMove = false;
                    }
                }

                if ($this.dragEl) {
                    e.preventDefault();
                    $this.dragMove(e);
                    $this.trigger('move.uk.nestable', [$this]);
                }
            };

            var onEndEvent = function(e) {

                if ($this.dragEl) {
                    e.preventDefault();
                    $this.dragStop(hasTouch ? e.touches[0] : e);
                }

                draggingElement = false;
                $this.delayMove = false;
            };

            if (hasTouch) {
                this.element[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } else {
                this.on(eStart, onStartEvent);
                $win.on(eMove, onMoveEvent);
                $win.on(eEnd, onEndEvent);
            }

        },

        serialize: function() {

            var data,
                depth = 0,
                list  = this,
                step  = function(level, depth) {

                    var array = [ ], items = level.children(list.options._listItemClass);

                    items.each(function() {

                        var li    = UI.$(this),
                            item  = {}, attribute,
                            sub   = li.children(list.options._listClass);

                        for (var i = 0, attr, val; i < li[0].attributes.length; i++) {
                            attribute = li[0].attributes[i];
                            if (attribute.name.indexOf('data-') === 0) {
                                attr       = attribute.name.substr(5);
                                val        =  UI.Utils.str2json(attribute.value);
                                item[attr] = (val || attribute.value=='false' || attribute.value=='0') ? val:attribute.value;
                            }
                        }

                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }

                        array.push(item);

                    });
                    return array;
                };

            data = step(list.element, depth);

            return data;
        },

        list: function(options) {

            var data  = [],
                list  = this,
                depth = 0,
                step  = function(level, depth, parent) {

                    var items = level.children(options._listItemClass);

                    items.each(function(index) {
                        var li   = UI.$(this),
                            item = UI.$.extend({parent_id: (parent ? parent : null), depth: depth, order: index}, li.data()),
                            sub  = li.children(options._listClass);

                        data.push(item);

                        if (sub.length) {
                            step(sub, depth + 1, li.data(options.idProperty || 'id'));
                        }
                    });
                };

            options = UI.$.extend({}, list.options, options);

            step(list.element, depth);

            return data;
        },

        reset: function() {

            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;

            for (var i=0; i<touchedlists.length; i++) {
                this.checkEmptyList(touchedlists[i]);
            }

            touchedlists = [];
        },

        toggleItem: function(li) {
            this[li.hasClass(this.options.collapsedClass) ? "expandItem":"collapseItem"](li);
        },

        expandItem: function(li) {
            li.removeClass(this.options.collapsedClass);
        },

        collapseItem: function(li) {
            var lists = li.children(this.options._listClass);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
            }
        },

        expandAll: function() {
            var list = this;
            this.find(list.options._listItemClass).each(function() {
                list.expandItem(UI.$(this));
            });
        },

        collapseAll: function() {
            var list = this;
            this.find(list.options._listItemClass).each(function() {
                list.collapseItem(UI.$(this));
            });
        },

        setParent: function(li) {

            if (li.children(this.options._listClass).length) {
                li.addClass("uk-parent");
            }
        },

        unsetParent: function(li) {
            li.removeClass('uk-parent '+this.options.collapsedClass);
            li.children(this.options._listClass).remove();
        },

        dragStart: function(e) {

            var mouse    = this.mouse,
                target   = UI.$(e.target),
                dragItem = target.closest(this.options._listItemClass),
                offset   = dragItem.offset();

            this.placeEl = dragItem;

            mouse.offsetX = e.pageX - offset.left;
            mouse.offsetY = e.pageY - offset.top;

            mouse.startX = mouse.lastX = offset.left;
            mouse.startY = mouse.lastY = offset.top;

            this.dragRootEl = this.element;

            this.dragEl = UI.$('<ul></ul>').addClass(this.options.listClass + ' ' + this.options.dragClass).append(dragItem.clone());
            this.dragEl.css('width', dragItem.width());
            this.placeEl.addClass(this.options.placeholderClass);

            draggingElement = this.dragEl;

            this.tmpDragOnSiblings = [dragItem[0].previousSibling, dragItem[0].nextSibling];

            UI.$body.append(this.dragEl);

            this.dragEl.css({
                left : offset.left,
                top  : offset.top
            });

            // total depth of dragging item
            var i, depth, items = this.dragEl.find(this.options._listItemClass);

            for (i = 0; i < items.length; i++) {
                depth = UI.$(items[i]).parents(this.options._listClass+','+this.options._listBaseClass).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }

            html.addClass(this.options.movingClass);
        },

        dragStop: function(e) {

            var el       = UI.$(this.placeEl),
                root     = this.placeEl.parents(this.options._listBaseClass+':first');

            this.placeEl.removeClass(this.options.placeholderClass);
            this.dragEl.remove();

            if (this.element[0] !== root[0]) {

                root.trigger('change.uk.nestable',[root.data('nestable'), el, 'added']);
                this.element.trigger('change.uk.nestable', [this, el, 'removed']);

            } else {
                this.element.trigger('change.uk.nestable',[this, el, "moved"]);
            }

            this.trigger('stop.uk.nestable', [this, el]);

            this.reset();

            html.removeClass(this.options.movingClass);
        },

        dragMove: function(e) {
            var list, parent, prev, next, depth,
                opt      = this.options,
                mouse    = this.mouse,
                maxDepth = this.dragRootEl ? this.dragRootEl.data('nestable').options.maxDepth : opt.maxDepth;

            this.dragEl.css({
                left : e.pageX - mouse.offsetX,
                top  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev('li');

                // increase horizontal level if previous sibling exists, is not collapsed, and does not have a 'no children' class
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass) && !prev.hasClass(opt.noChildrenClass)) {

                    // cannot increase level when item above is collapsed
                    list = prev.find(opt._listClass).last();

                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt._listClass+','+opt._listBaseClass).length;

                    if (depth + this.dragDepth <= maxDepth) {

                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = UI.$('<ul/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt._listClass).last();
                            list.append(this.placeEl);
                        }
                    }
                }

                // decrease horizontal level
                if (mouse.distX < 0) {

                    // we cannot decrease the level if an item precedes the current one
                    next = this.placeEl.next(opt._listItemClass);
                    if (!next.length) {

                        // get parent ul of the list item
                        var parentUl = this.placeEl.closest([opt._listBaseClass, opt._listClass].join(','));
                        // try to get the li surrounding the ul
                        var surroundingLi = parentUl.closest(opt._listItemClass);

                        // if the ul is inside of a li (meaning it is nested)
                        if (surroundingLi.length) {
                            // we can decrease the horizontal level
                            surroundingLi.after(this.placeEl);
                            // if the previous parent ul is now empty
                            if (!parentUl.children().length) {
                                this.unsetParent(surroundingLi);
                            }
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            var pointX = e.pageX - (window.pageXOffset || document.scrollLeft || 0),
                pointY = e.pageY - (window.pageYOffset || document.documentElement.scrollTop);
            this.pointEl = UI.$(document.elementFromPoint(pointX, pointY));

            if (opt.handleClass && this.pointEl.hasClass(opt.handleClass)) {

                this.pointEl = this.pointEl.closest(opt._listItemClass);

            } else {

                var nestableitem = this.pointEl.closest(opt._listItemClass);

                if (nestableitem.length) {
                    this.pointEl = nestableitem;
                }
            }

            if (this.placeEl.find(this.pointEl).length) {
                return;
            }

            if (this.pointEl.data('nestable') && !this.pointEl.children().length) {
                isEmpty = true;
                this.checkEmptyList(this.pointEl);
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.listItemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.element,
                tmpRoot     = this.pointEl.closest(this.options._listBaseClass),
                isNewRoot   = pointElRoot[0] != tmpRoot[0];

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {

                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== tmpRoot.data('nestable-group')) {
                    return;
                } else {
                    touchedlists.push(pointElRoot);
                }

                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt._listClass+','+opt._listBaseClass).length;

                if (depth > maxDepth) {
                    return;
                }

                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);

                parent = this.placeEl.parent();

                if (isEmpty) {
                    this.pointEl.append(this.placeEl);
                } else if (before) {
                    this.pointEl.before(this.placeEl);
                } else {
                    this.pointEl.after(this.placeEl);
                }

                if (!parent.children().length) {
                    if (!parent.data("nestable")) this.unsetParent(parent.parent());
                }

                this.checkEmptyList(this.dragRootEl);
                this.checkEmptyList(pointElRoot);

                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = tmpRoot;
                    this.hasNewRoot = this.element[0] !== this.dragRootEl[0];
                }
            }
        },

        checkEmptyList: function(list) {

            list  = list ? UI.$(list) : this.element;

            if (this.options.emptyClass) {
                list[!list.children().length ? 'addClass':'removeClass'](this.options.emptyClass);
            }
        }

    });

    return UI.nestable;
});
