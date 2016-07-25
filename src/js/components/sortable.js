import $ from 'jquery';
import { util, mixin } from 'uikit';

var { hasTouch, pointerDown, pointerMove, pointerUp, uniqueId } = util;

var draggingPlaceholder, currentlyDraggingElement, currentlyDraggingTarget, dragging, moving, clickedlink, delayIdle, touchedlists, moved, overElement, startEvent;

var html = $('html');
var win = $(window);
var doc = $(document.documentElement);

html.on(pointerMove, function (e) {

    if (delayIdle) {

        var src = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;

        if (Math.abs(src.pageX - delayIdle.pos.x) > delayIdle.threshold || Math.abs(src.pageY - delayIdle.pos.y) > delayIdle.threshold) {
            delayIdle.apply(src);
        }
    }

    if (draggingPlaceholder) {

        if (!moving) {
            moving = true;
            draggingPlaceholder.show();

            draggingPlaceholder.$current.addClass(draggingPlaceholder.$sortable.clsPlaceholder);
            draggingPlaceholder.$sortable.$el.children().addClass(draggingPlaceholder.$sortable.clsChild);

            html.addClass(draggingPlaceholder.$sortable.clsDragMoving);
        }

        var offset = draggingPlaceholder.data('mouse-offset'),
            ev = e.originalEvent.touches && e.originalEvent.touches[0] || e.originalEvent,
            left = parseInt(ev.pageX, 10) + offset.left,
            top = parseInt(ev.pageY, 10) + offset.top;

        draggingPlaceholder.css({'left': left, 'top': top});

        // adjust document scrolling

        if (top + (draggingPlaceholder.height() / 3) > document.body.offsetHeight) {
            return;
        }

        if (top < win.scrollTop()) {
            win.scrollTop(win.scrollTop() - Math.ceil(draggingPlaceholder.height() / 3));
        } else if ((top + (draggingPlaceholder.height() / 3)) > (window.innerHeight + win.scrollTop())) {
            win.scrollTop(win.scrollTop() + Math.ceil(draggingPlaceholder.height() / 3));
        }
    }
});

html.on(pointerUp, function (e) {

    delayIdle = clickedlink = false;

    // dragging?
    if (!currentlyDraggingElement || !draggingPlaceholder) {
        // completely reset dragging attempt. will cause weird delay behavior otherwise
        currentlyDraggingElement = draggingPlaceholder = null;
        return;
    }

    // inside or outside of sortable?
    var sortable = closestSortable(currentlyDraggingElement),
        component = draggingPlaceholder.$sortable,
        ev = {type: e.type};

    if (sortable[0]) {
        component.dragDrop(ev, component.$el);
    }
    component.dragEnd(ev, component.$el);
});

UIkit.component('sortable', {

    mixins: [mixin.class],

    props: {
        animation: Number,
        threshold: Number,
        clsChild: String,
        clsPlaceholder: String,
        clsOver: String,
        clsDragging: String,
        clsDragMoving: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsDragCustom: String,
        clsHandle: String,
        group: String
    },

    defaults: {
        animation: 150,
        threshold: 10,
        clsChild: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsOver: 'uk-sortable-over',
        clsDragging: 'uk-sortable-dragged',
        clsDragMoving: 'uk-sortable-moving',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsDragCustom: '',
        clsHandle: false,
        group: false,

        stop() {
        },
        start() {
        },
        change() {
        }
    },

    ready() {

        var $this = this,
            element = this.$el[0];

        touchedlists = [];

        this.checkEmptyList();

        this.$el.data('sortable-group', this.group ? this.group : uniqueId('sortable-group'));

        var handleDragStart = delegate(function (e) {

            if (e.data && e.data.sortable) {
                return;
            }

            var $target = $(e.target),
                $link = $target.is('a[href]') ? $target : $target.parents('a[href]');

            if ($target.is(':input')) {
                return;
            }

            if ($this.clsHandle) {
                var handle = $target.hasClass($this.clsHandle) ? $target : $target.closest('.' + $this.clsHandle, $this.$el);
                if (!handle.length) return;
            }

            e.preventDefault();

            if ($link.length) {

                $link.one('click', function (e) {
                    e.preventDefault();
                }).one(pointerUp, function () {

                    if (!moved) {
                        $link.trigger('click');
                        if (hasTouch && $link.attr('href').trim()) {
                            location.href = $link.attr('href');
                        }
                    }
                });
            }

            e.data = e.data || {};

            e.data.sortable = element;

            return $this.dragStart(e, this);
        });

        // TODO throttle?
        var handleDragEnter = delegate(function (e) {
            return $this.dragEnter(e, this);
        });

        var handleDragLeave = delegate(function (e) {

            // Prevent dragenter on a child from allowing a dragleave on the container
            var previousCounter = $this.dragenterData(this);
            $this.dragenterData(this, previousCounter - 1);

            // This is a fix for child elements firing dragenter before the parent fires dragleave
            if (!$this.dragenterData(this)) {
                $(this).removeClass($this.clsOver);
                $this.dragenterData(this, false);
            }
        });

        var handleTouchMove = delegate(function (e) {

            if (!currentlyDraggingElement ||
                currentlyDraggingElement === this ||
                currentlyDraggingTarget === this) {
                return true;
            }

            $this.$el.children().removeClass($this.clsOver);
            currentlyDraggingTarget = this;

            $this.moveElementNextTo(currentlyDraggingElement, this);

            return prevent(e);
        });

        // Bind/unbind standard mouse/touch events as a polyfill.
        function addDragHandlers() {

            if (hasTouch && startEvent.touches && startEvent.touches.length) {
                element.addEventListener(pointerMove, handleTouchMove, false);
            } else {
                element.addEventListener('mouseover', handleDragEnter, false);
                element.addEventListener('mouseout', handleDragLeave, false);
            }

            // document.addEventListener("selectstart", prevent, false);
        }

        function removeDragHandlers() {
            if (hasTouch && startEvent.touches && startEvent.touches.length) {
                element.removeEventListener(pointerMove, handleTouchMove, false);
            } else {
                element.removeEventListener('mouseover', handleDragEnter, false);
                element.removeEventListener('mouseout', handleDragLeave, false);
            }

            // document.removeEventListener("selectstart", prevent, false);
        }

        this.addDragHandlers = addDragHandlers;
        this.removeDragHandlers = removeDragHandlers;

        function handleDragMove(e) {

            if (!currentlyDraggingElement) {
                return;
            }

            $this.dragMove(e, $this);
        }

        function delegate(fn) {

            return function (e) {

                var touch, target, context;

                startEvent = e;

                if (e) {
                    touch = e.touches && e.touches[0] || e;
                    target = touch.target || e.target;

                    // Fix event.target for a touch event
                    if (hasTouch && document.elementFromPoint) {
                        target = document.elementFromPoint(touch.pageX - document.body.scrollLeft, touch.pageY - document.body.scrollTop);
                    }

                    overElement = $(target);
                }

                if ($(target).hasClass('.' + $this.clsChild)) {
                    fn.apply(target, [e]);
                } else if (target !== element) {

                    // If a child is initiating the event or ending it, then use the container as context for the callback.
                    context = moveUpToChildNode(element, target);

                    if (context) {
                        fn.apply(context, [e]);
                    }
                }
            };
        }

        window.addEventListener(pointerMove, handleDragMove, false);
        element.addEventListener(pointerDown, handleDragStart, false);

    },

    methods: {

        dragStart: function (e, elem) {

            moved = false;
            moving = false;
            dragging = false;

            var $this = this,
                target = $(e.target);

            if (!hasTouch && e.button == 2) {
                return;
            }

            if (target.is('.' + $this.clsNoDrag) || target.closest('.' + $this.clsNoDrag).length) {
                return;
            }

            // prevent dragging if taget is a form field
            if (target.is(':input')) {
                return;
            }

            currentlyDraggingElement = elem;

            // init drag placeholder
            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
            }

            var $current = $(currentlyDraggingElement), offset = $current.offset(), ev = e.touches && e.touches[0] || e;

            delayIdle = {

                pos: {x: ev.pageX, y: ev.pageY},
                threshold: $this.clsHandle ? 1 : $this.threshold,
                apply: function (evt) {

                    draggingPlaceholder = $('<div class="' + ([$this.clsDragging, $this.clsDragCustom].join(' ')) + '"></div>').css({
                        display: 'none',
                        top: offset.top,
                        left: offset.left,
                        width: $current.width(),
                        height: $current.height(),
                        padding: $current.css('padding')
                    }).data({
                        'mouse-offset': {
                            'left': offset.left - parseInt(ev.pageX, 10),
                            'top': offset.top - parseInt(ev.pageY, 10)
                        },
                        'origin': $this.$el,
                        'index': $current.index()
                    }).append($current.html()).appendTo('body');

                    draggingPlaceholder.$current = $current;
                    draggingPlaceholder.$sortable = $this;

                    $current.data({
                        'start-list': $current.parent(),
                        'start-index': $current.index(),
                        'sortable-group': $this.group
                    });

                    $this.addDragHandlers();

                    $this.start(this, currentlyDraggingElement);
                    $this.$el.trigger('start.uk.sortable', [$this, currentlyDraggingElement, draggingPlaceholder]);

                    moved = true;
                    delayIdle = false;
                }
            };
        },

        dragMove: function (e, elem) {

            overElement = $(document.elementFromPoint(e.pageX - (document.body.scrollLeft || document.scrollLeft || 0), e.pageY - (document.body.scrollTop || document.documentElement.scrollTop || 0)));

            var overRoot = overElement.closest('.' + this.clsBase),
                groupOver = overRoot.data("sortable-group"),
                $current = $(currentlyDraggingElement),
                currentRoot = $current.parent(),
                groupCurrent = $current.data("sortable-group"),
                overChild;

            if (overRoot[0] !== currentRoot[0] && groupCurrent !== undefined && groupOver === groupCurrent) {

                UIkit.getComponent(overRoot[0], 'sortable').addDragHandlers();

                touchedlists.push(overRoot);
                overRoot.children().addClass(this.clsChild);

                // swap root
                if (overRoot.children().length > 0) {
                    overChild = overElement.closest('.' + this.clsChild);

                    if (overChild.length) {
                        overChild.before($current);
                    } else {
                        overRoot.append($current);
                    }

                } else { // empty list
                    overElement.append($current);
                }

                doc.trigger('mouseover');
            }

            this.checkEmptyList();
            this.checkEmptyList(currentRoot);
        },

        dragEnter: function (e, elem) {

            if (!currentlyDraggingElement || currentlyDraggingElement === elem) {
                return true;
            }

            var previousCounter = this.dragenterData(elem);

            this.dragenterData(elem, previousCounter + 1);

            // Prevent dragenter on a child from allowing a dragleave on the container
            if (previousCounter === 0) {

                var currentlist = $(elem).parent(),
                    startlist = $(currentlyDraggingElement).data("start-list");

                if (currentlist[0] !== startlist[0]) {

                    var groupOver = currentlist.data('sortable-group'),
                        groupCurrent = $(currentlyDraggingElement).data("sortable-group");

                    if ((groupOver || groupCurrent) && (groupOver != groupCurrent)) {
                        return false;
                    }
                }

                $(elem).addClass(this.clsOver);
                this.moveElementNextTo(currentlyDraggingElement, elem);
            }

            return false;
        },

        dragEnd: function (e, elem) {

            var $this = this;

            // avoid triggering event twice
            if (currentlyDraggingElement) {
                // TODO: trigger on right element?
                this.stop(elem);
                this.$el.trigger('stop.uk.sortable', [this]);
            }

            currentlyDraggingElement = null;
            currentlyDraggingTarget = null;

            touchedlists.push(this.$el);
            touchedlists.forEach(function (el, i) {
                $(el).children().each(function () {
                    if (this.nodeType === 1) {
                        $(this).removeClass($this.clsOver)
                            .removeClass($this.clsPlaceholder)
                            .removeClass($this.clsChild);
                        $this.dragenterData(this, false);
                    }
                });
            });

            touchedlists = [];

            html.removeClass(this.clsDragMoving);

            this.removeDragHandlers();

            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
                draggingPlaceholder = null;
            }
        },

        dragDrop: function (e, elem) {

            if (e.type === 'drop') {

                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }
            }

            this.triggerChangeEvents();
        },

        triggerChangeEvents: function () {

            // trigger events once
            if (!currentlyDraggingElement) return;

            var $current = $(currentlyDraggingElement),
                oldRoot = draggingPlaceholder.data("origin"),
                newRoot = $current.closest('.' + this.clsBase),
                triggers = [],
                el = $(currentlyDraggingElement);

            // events depending on move inside lists or across lists
            if (oldRoot[0] === newRoot[0] && draggingPlaceholder.data('index') != $current.index()) {
                triggers.push({sortable: this, mode: 'moved'});
            } else if (oldRoot[0] != newRoot[0]) {
                triggers.push({sortable: UIkit.getComponent(newRoot[0], 'sortable'), mode: 'added'}, {sortable: UIkit.getComponent(oldRoot[0], 'sortable'), mode: 'removed'});
            }

            triggers.forEach(function (trigger, i) {
                if (trigger.sortable) {
                    trigger.sortable.element.trigger('change.uk.sortable', [trigger.sortable, el, trigger.mode]);
                }
            });
        },

        dragenterData: function (element, val) {

            element = $(element);

            if (arguments.length == 1) {
                return parseInt(element.data('child-dragenter'), 10) || 0;
            } else if (!val) {
                element.removeData('child-dragenter');
            } else {
                element.data('child-dragenter', Math.max(0, val));
            }
        },

        moveElementNextTo: function (element, elementToMoveNextTo) {

            dragging = true;

            var $this = this,
                list = $(element).parent().css('min-height', ''),
                next = isBelow(element, elementToMoveNextTo) ? elementToMoveNextTo : elementToMoveNextTo.nextSibling,
                children = list.children(),
                count = children.length;

            if (!$this.animation) {
                elementToMoveNextTo.parentNode.insertBefore(element, next);
                this.$update(null, $this.$el.parent());
                return;
            }

            list.css('min-height', list.height());

            children.stop().each(function () {
                var ele = $(this),
                    offset = ele.position();

                offset.width = ele.width();

                ele.data('offset-before', offset);
            });

            elementToMoveNextTo.parentNode.insertBefore(element, next);

            this.$update(null, $this.$el.parent());

            children = list.children().each(function () {
                var ele = $(this);
                ele.data('offset-after', ele.position());
            }).each(function () {
                var ele = $(this),
                    before = ele.data('offset-before');
                ele.css({'position': 'absolute', 'top': before.top, 'left': before.left, 'min-width': before.width});
            });

            children.each(function () {

                var ele = $(this),
                    before = ele.data('offset-before'),
                    offset = ele.data('offset-after');

                ele.css('pointer-events', 'none').width();

                setTimeout(function () {
                    ele.animate({'top': offset.top, 'left': offset.left}, $this.animation, function () {
                        ele.css({'position': '', 'top': '', 'left': '', 'min-width': '', 'pointer-events': ''}).removeClass($this.clsOver).removeData('child-dragenter');
                        count--;
                        if (!count) {
                            list.css('min-height', '');
                            $this.$update(null, $this.$el.parent());
                        }
                    });
                }, 0);
            });
        },

        serialize: function () {

            var data = [], item, attribute;

            this.$el.children().each(function (j, child) {
                item = {};
                for (var i = 0, attr, val; i < child.attributes.length; i++) {
                    attribute = child.attributes[i];
                    if (attribute.name.indexOf('data-') === 0) {
                        attr = attribute.name.substr(5);
                        item[attr] = attribute.value;
                    }
                }
                data.push(item);
            });

            return data;
        },

        checkEmptyList: function (list) {

            list = list ? $(list) : this.$el;

            if (this.clsEmpty) {
                list[!list.children().length ? 'addClass' : 'removeClass'](this.clsEmpty);
            }
        }

    }

});

function closestSortable(ele) {

    ele = $(ele);

    do {
        if (UIkit.getComponent(ele[0], 'sortable')) {
            return ele;
        }
        ele = $(ele).parent();
    } while (ele.length);

    return ele;
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
    if (cur == parent) {
        return null;
    }

    while (cur) {
        if (cur.parentNode === parent) {
            return cur;
        }

        cur = cur.parentNode;
        if (!cur || !cur.ownerDocument || cur.nodeType === 11) {
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
