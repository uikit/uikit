import $ from 'jquery';
import { util, mixin } from 'uikit';

var { hasTouch, isWithin, pointerDown, pointerMove, pointerUp, requestAnimationFrame, uniqueId } = util;

var placeholder, dragElement, dragTarget, moving, clickedLink, delayIdle, touchedLists, moved, startEvent;

var win = $(window), doc = $(document.documentElement);

doc.on({

    [pointerMove](e) {

        if (delayIdle) {

            var src = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;

            if (Math.abs(src.pageX - delayIdle.pos.x) > delayIdle.threshold || Math.abs(src.pageY - delayIdle.pos.y) > delayIdle.threshold) {
                delayIdle.apply(src);
            }
        }

        if (placeholder) {

            if (!moving) {
                moving = true;
                placeholder.show();

                placeholder.$current.addClass(placeholder.$sortable.clsPlaceholder);
                placeholder.$sortable.$el.children().addClass(placeholder.$sortable.clsChild);

                doc.addClass(placeholder.$sortable.clsDragMoving);
            }

            var offset = placeholder.data('mouse-offset'),
                ev = e.originalEvent.touches && e.originalEvent.touches[0] || e.originalEvent,
                left = parseInt(ev.pageX, 10) + offset.left,
                top = parseInt(ev.pageY, 10) + offset.top;

            placeholder.css({left, top});

            var height = Math.ceil(placeholder.height() / 3),
                scroll = win.scrollTop();

            // adjust document scrolling
            if (top + height > document.body.offsetHeight) {
                return;
            }

            if (top < scroll) {
                win.scrollTop(scroll - height);
            } else if (top + height > window.innerHeight + scroll) {
                win.scrollTop(scroll + height);
            }
        }

    },

    [pointerUp](e) {

        delayIdle = clickedLink = false;

        // dragging?
        if (!dragElement || !placeholder) {
            // completely reset dragging attempt. This will cause weird delay behavior otherwise
            dragElement = placeholder = null;
            return;
        }

        // inside or outside of sortable?
        var sortable = closestSortable(dragElement),
            component = placeholder.$sortable,
            ev = {type: e.type};

        if (sortable[0]) {
            component.dragDrop(ev, component.$el);
        }
        component.dragEnd(ev, component.$el);
    }

});

UIkit.component('sortable', {

    mixins: [mixin.class],

    props: {
        group: String,
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
        clsHandle: String
    },

    defaults: {
        group: false,
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
        clsHandle: false
    },

    ready() {

        var $this = this, element = this.$el[0];

        touchedLists = [];

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
                var handle = $target.hasClass($this.clsHandle) ? $target : $target.closest(`.${$this.clsHandle}`, $this.$el);
                if (!handle.length) {
                    return;
                }
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

            if (!dragElement || dragElement === this || dragTarget === this) {
                return true;
            }

            $this.$el.children().removeClass($this.clsOver);
            dragTarget = this;

            $this.moveElementNextTo(dragElement, this);

            return prevent(e);
        });

        // Bind/unbind standard mouse/touch events as a polyfill.
        this.addDragHandlers = function () {

            if (hasTouch && startEvent.touches && startEvent.touches.length) {
                element.addEventListener(pointerMove, handleTouchMove);
            } else {
                element.addEventListener('mouseover', handleDragEnter);
                element.addEventListener('mouseout', handleDragLeave);
            }

        };

        this.removeDragHandlers = function () {
            if (hasTouch && startEvent.touches && startEvent.touches.length) {
                element.removeEventListener(pointerMove, handleTouchMove);
            } else {
                element.removeEventListener('mouseover', handleDragEnter);
                element.removeEventListener('mouseout', handleDragLeave);
            }

        };

        function delegate(fn, cls) {

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

                }

                if ($(target).hasClass(`.${cls}`)) {
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

        window.addEventListener(pointerMove, function (e) {

            if (!dragElement) {
                return;
            }

            $this.dragMove(e, $this);
        });

        element.addEventListener(pointerDown, handleDragStart);

    },

    methods: {

        dragStart(e, elem) {

            moved = false;
            moving = false;

            var $this = this,
                target = $(e.target);

            if (!hasTouch && e.button == 2) {
                return;
            }

            if (isWithin(target, `.${$this.clsNoDrag}`)) {
                return;
            }

            // prevent dragging if target is a form field
            if (target.is(':input')) {
                return;
            }

            dragElement = elem;

            // init drag placeholder
            if (placeholder) {
                placeholder.remove();
            }

            var $current = $(dragElement), offset = $current.offset(), ev = e.touches && e.touches[0] || e;

            delayIdle = {

                pos: {x: ev.pageX, y: ev.pageY},
                threshold: $this.clsHandle ? 1 : $this.threshold,
                apply: function (evt) {

                    placeholder = $(`<div class="${([$this.clsDragging, $this.clsDragCustom].join(' '))}"></div>`).css({
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

                    placeholder.$current = $current;
                    placeholder.$sortable = $this;

                    $current.data({
                        'start-list': $current.parent(),
                        'start-index': $current.index(),
                        'sortable-group': $this.group
                    });

                    $this.addDragHandlers();

                    $this.start(this, dragElement);
                    $this.$el.trigger('start', [$this, dragElement, placeholder]);

                    moved = true;
                    delayIdle = false;
                }
            };
        },

        dragMove(e) {

            var overElement = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop)),
                overRoot = overElement.closest(`.${this.clsBase}`),
                groupOver = overRoot.data('sortable-group'),
                $current = $(dragElement),
                currentRoot = $current.parent(),
                groupCurrent = $current.data('sortable-group'),
                overChild;

            if (overRoot[0] !== currentRoot[0] && groupCurrent !== undefined && groupOver === groupCurrent) {

                UIkit.getComponent(overRoot[0], 'sortable').addDragHandlers();

                touchedLists.push(overRoot);
                overRoot.children().addClass(this.clsChild);

                // swap root
                if (overRoot.children().length > 0) {
                    overChild = overElement.closest(`.${this.clsChild}`);

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

        dragEnter(e, element) {

            if (!dragElement || dragElement === element) {
                return true;
            }

            var previousCounter = this.dragenterData(element);

            this.dragenterData(element, previousCounter + 1);

            // Prevent dragenter on a child from allowing a dragleave on the container
            if (previousCounter === 0) {

                var currentList = $(element).parent(),
                    startList = $(dragElement).data('start-list');

                if (currentList[0] !== startList[0]) {

                    var groupOver = currentList.data('sortable-group'),
                        groupCurrent = $(dragElement).data('sortable-group');

                    if ((groupOver || groupCurrent) && (groupOver != groupCurrent)) {
                        return false;
                    }
                }

                $(element).addClass(this.clsOver);
                this.moveElementNextTo(dragElement, element);
            }

            return false;
        },

        dragEnd(e, element) {

            // avoid triggering event twice
            if (dragElement) {
                this.stop(element);
                this.$el.trigger('stop', [this]);
            }

            dragElement = null;
            dragTarget = null;

            touchedLists.push(this.$el);
            touchedLists.forEach(el => {
                $(el).children().each((i, el) => {
                    if (el.nodeType === Node.ELEMENT_NODE) {
                        $(el).removeClass(`${this.clsOver} ${this.clsPlaceholder} ${this.clsChild}`);
                        this.dragenterData(el, false);
                    }
                });
            });

            touchedLists = [];

            doc.removeClass(this.clsDragMoving);

            this.removeDragHandlers();

            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }
        },

        dragDrop(e) {

            if (e.type === 'drop') {
                prevent(e);
            }

            this.triggerChangeEvents();
        },

        triggerChangeEvents() {

            // trigger events once
            if (!dragElement) {
                return;
            }

            var $current = $(dragElement),
                oldRoot = placeholder.data('origin'),
                newRoot = $current.closest(`.${this.clsBase}`),
                triggers = [],
                el = $(dragElement);

            // events depending on move inside lists or across lists
            if (oldRoot[0] === newRoot[0] && placeholder.data('index') != $current.index()) {
                triggers.push({sortable: this, mode: 'moved'});
            } else if (oldRoot[0] != newRoot[0]) {
                triggers.push(
                    {sortable: UIkit.getComponent(newRoot[0], 'sortable'), mode: 'added'},
                    {sortable: UIkit.getComponent(oldRoot[0], 'sortable'), mode: 'removed'}
                );
            }

            triggers.forEach(trigger => {
                if (trigger.sortable) {
                    trigger.sortable.$el.trigger('change', [trigger.sortable, el, trigger.mode]);
                }
            });
        },

        dragenterData(element, val) {

            element = $(element);

            if (arguments.length == 1) {
                return parseInt(element.data('child-dragenter'), 10) || 0;
            } else if (!val) {
                element.removeData('child-dragenter');
            } else {
                element.data('child-dragenter', Math.max(0, val));
            }
        },

        moveElementNextTo(element, target) {

            var list = $(element).parent().css('min-height', ''),
                next = isBelow(element, target) ? target : target.nextSibling,
                children = list.children(),
                count = children.length;

            if (!this.animation) {
                target.parentNode.insertBefore(element, next);
                this.$update(null, this.$el.parent());
                return;
            }

            list.css('min-height', list.height());

            children.stop().each((i, el) => {

                el = $(el);

                var offset = el.position();

                offset.width = el.width();

                el.data('offset-before', offset);
            });

            target.parentNode.insertBefore(element, next);

            this.$update(null, this.$el.parent());

            children = list.children().each((_, el) => {
                el = $(el);
                el.data('offset-after', el.position());
            }).each((_, el) => {
                el = $(el);

                var before = el.data('offset-before');
                el.css({position: 'absolute', top: before.top, left: before.left, minWidth: before.width});
            });

            children.each((_, el) => {

                el = $(el);

                var before = el.data('offset-before'),
                    offset = el.data('offset-after');

                el.css('pointer-events', 'none').width();

                requestAnimationFrame(() => {
                    el.animate({top: offset.top, left: offset.left}, this.animation, () => {
                        el.css({position: '', top: '', left: '', minWidth: '', pointerEvents: ''}).removeClass(this.clsOver).removeData('child-dragenter');
                        count--;
                        if (!count) {
                            list.css('min-height', '');
                            this.$update(null, this.$el.parent());
                        }
                    });
                });
            });
        },

        serialize() {

            var data = [], item, attribute;

            this.$el.children().each(function (j, child) {
                item = {};
                for (var i = 0, attr; i < child.attributes.length; i++) {
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

        checkEmptyList(list) {
            if (this.clsEmpty) {
                list = list ? $(list) : this.$el;
                list.toggleClass(this.clsEmpty, !list.children().length);
            }
        }

    }

});

function closestSortable(element) {

    element = $(element)[0];

    while (element.parentNode) {
        if (UIkit.getComponent(element.parentNode, 'sortable')) {
            return element.parentNode;
        }

        element = element.parentNode;
    }

    return false;
}

function isBelow(el1, el2) {

    var parent = el1.parentNode;

    if (el2.parentNode !== parent) {
        return false;
    }

    var prev = el1.previousSibling;

    while (prev) {
        if (prev === el2) {
            return true;
        }
        prev = prev.previousSibling;
    }

    return false;
}

function moveUpToChildNode(parent, child) {
    var cur = child;
    if (cur === parent) {
        return null;
    }

    while (cur) {
        if (cur.parentNode === parent) {
            return cur;
        }

        cur = cur.parentNode;
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
