/*! UIkit 2.6.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

/*
 * Based on Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 */
 (function(addon) {

     if (typeof define == "function" && define.amd) { // AMD
         define("uikit-sortable", ["uikit"], function(){
            return jQuery.fn.uksortable || addon(window.jQuery, jQuery.UIkit, window, document);
         });
     }

     if(window && window.jQuery && window.jQuery.UIkit) {
         addon(window.jQuery, jQuery.UIkit, window, document);
     }

 })(function($, UI, window, document, undefined) {

    var hasTouch     = 'ontouchstart' in window,
        html         = $("html"),
        touchedlists = [];

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var eStart  = hasTouch ? 'touchstart'  : 'mousedown',
        eMove   = hasTouch ? 'touchmove'   : 'mousemove',
        eEnd    = hasTouch ? 'touchend'    : 'mouseup',
        eCancel = hasTouch ? 'touchcancel' : 'mouseup';

    function Plugin(element, options)
    {
        var $element = $(element);

        if($element.data("uksortable")) return;


        this.w  = $(window);
        this.el = $element;
        this.options = $.extend({}, $.fn.uksortable.defaults, options);

        this.tplempty = '<div class="' + this.options.emptyClass + '"/>';

        this.el.find(">"+this.options.itemNodeName).addClass(this.options.listitemClass).end().find("ul:not(.ignore-list)").addClass(this.options.listClass).find(">li").addClass(this.options.listitemClass);

        if(!this.el.children(this.options.itemNodeName).length) {
            this.el.append(this.tplempty);
        }

        this.el.data("uksortable", this);
        this.el.data("uksortable-id", "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() *100000)));

        this.init();
    }

    Plugin.prototype = {

        init: function()
        {
            var list = this;

            list.reset();

            list.el.data('uksortable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el)
            {
                list.setParent($(el));
            });

            list.el.on('click', '[data-sortable-action]', function(e)
            {
                if (list.dragEl || (!hasTouch && e.button !== 0)) {
                    return;
                }

                e.preventDefault();

                var target = $(e.currentTarget),
                    action = target.data('sortableAction'),
                    item   = target.closest(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
                if (action === 'toggle') {
                    list.toggleItem(item);
                }
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }
                if (!handle.length || list.dragEl || (!hasTouch && e.button !== 0) || (hasTouch && e.touches.length !== 1)) {
                    return;
                }
                e.preventDefault();
                list.dragStart(hasTouch ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(hasTouch ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(hasTouch ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } else {
                list.el.on(eStart, onStartEvent);
                list.w.on(eMove, onMoveEvent);
                list.w.on(eEnd, onEndEvent);
            }

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth)
                {
                    var array = [ ],
                        items = level.children(list.options.itemNodeName);
                    items.each(function()
                    {
                        var li   = $(this),
                            item = $.extend({}, li.data()),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el, depth);
            return data;
        },

        list: function(options)
        {
            var data = [],
                list = this,
                depth = 0,
                options = $.extend({}, list.options, options),
                step = function(level, depth, parent)
                {
                    var items = level.children(options.itemNodeName);
                    items.each(function(index)
                    {
                        var li = $(this),
                            item = $.extend({parent_id: (parent ? parent : null), depth: depth, order: index}, li.data()),
                            sub = li.children(options.listNodeName);

                        data.push(item);
                        if (sub.length) {
                            step(sub, depth + 1, li.data(options.idProperty || 'id'));
                        }
                    });
                };
            step(list.el, depth);
            return data;
        },

        reset: function()
        {
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

            for(var i=0; i<touchedlists.length; i++) {
                if(!touchedlists[i].children().length) {
                    touchedlists[i].append(this.tplempty);
                }
            }

            touchedlists = [];
        },

        toggleItem: function(li) {
            this[li.hasClass(this.options.collapsedClass) ? "expandItem":"collapseItem"](li);
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
        },

        collapseItem: function(li)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function()
            {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function()
            {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.addClass("uk-parent");
            }
        },

        unsetParent: function(li)
        {
            li.removeClass('uk-parent '+this.options.collapsedClass);
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName),
                offset   = dragItem.offset();

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.pageX - offset.left;
            mouse.offsetY = e.pageY - offset.top;

            mouse.startX = mouse.lastX = offset.left;
            mouse.startY = mouse.lastY = offset.top;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            this.tmpDragOnSiblings = [dragItem[0].previousSibling, dragItem[0].nextSibling];

            // fix for zepto.js
            //dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);

            this.dragEl.css({
                left : offset.left,
                top  : offset.top
            });

            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }

            html.addClass(this.options.movingClass);
        },

        dragStop: function(e)
        {
            // fix for zepto.js
            //this.placeEl.replaceWith(this.dragEl.children(this.options.itemNodeName + ':first').detach());
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();

            if (this.tmpDragOnSiblings[0]!=el[0].previousSibling || this.tmpDragOnSiblings[0]!=el[0].previousSibling) {

                this.el.trigger('sortable-change',[el, this.hasNewRoot ? "added":"moved"]);

                if (this.hasNewRoot) {
                    this.dragRootEl.trigger('sortable-change', [el, "removed"]);
                }
            }

            this.reset();

            html.removeClass(this.options.movingClass);
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

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
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }

            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.closest(opt.itemNodeName);
            } else {

                var sortableitem = this.pointEl.closest('.'+opt.itemClass);

                if(sortableitem.length) {
                    this.pointEl = sortableitem.closest(opt.itemNodeName);
                }
            }

            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (this.pointEl.data('uksortable') && !this.pointEl.children().length) {
                isEmpty = true;
                this.pointEl = $(this.tplempty).appendTo(this.pointEl);
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.listitemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.el,
                tmpRoot     = this.pointEl.closest('.'+this.options.listBaseClass),
                isNewRoot   = pointElRoot[0] !== this.pointEl.closest('.'+this.options.listBaseClass)[0],
                $newRoot    = tmpRoot;

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== $newRoot.data('uksortable-group')) {
                    return;
                } else {
                    touchedlists.push(pointElRoot);
                }

                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    this.pointEl.replaceWith(this.placeEl);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    if(!parent.data("uksortable")) this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length && !this.dragRootEl.children().length) {
                    this.dragRootEl.append(this.tplempty);
                }

                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = tmpRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.uksortable = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var element = $(this),
                plugin  = element.data("uksortable");

            if (!plugin) {
                plugin = new Plugin(element, params);
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

    $.fn.uksortable.defaults = {
        prefix          : 'uk',
        listNodeName    : 'ul',
        itemNodeName    : 'li',
        listBaseClass   : '{prefix}-sortable',
        listClass       : '{prefix}-sortable-list',
        listitemClass   : '{prefix}-sortable-list-item',
        itemClass       : '{prefix}-sortable-item',
        dragClass       : '{prefix}-sortable-list-dragged',
        movingClass     : '{prefix}-sortable-moving',
        handleClass     : '{prefix}-sortable-handle',
        collapsedClass  : '{prefix}-collapsed',
        placeClass      : '{prefix}-sortable-placeholder',
        noDragClass     : '{prefix}-sortable-nodrag',
        emptyClass      : '{prefix}-sortable-empty',
        group           : 0,
        maxDepth        : 10,
        threshold       : 20
    };

    $(document).on("uk-domready", function(e) {

        $("[data-uk-sortable]").each(function(){

          var ele     = $(this),
              options = $.extend({}, $.fn.uksortable.defaults, UI.Utils.options(ele.attr("data-uk-sortable")));

          Object.keys(options).forEach(function(key){

              if(String(options[key]).indexOf('{prefix}')!=-1) {
                  options[key] = options[key].replace('{prefix}', options.prefix);
              }
          });

          if(!ele.data("uksortable")) {
              ele.uksortable(options);
          }
        });
    });

    return $.fn.uksortable;

});