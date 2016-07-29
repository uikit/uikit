import $ from 'jquery';
import { util, mixin } from 'uikit';

var {extend, isWithin, Observer, pointerDown, pointerMove, pointerUp} = util;

var win = $(window), doc = $(document.documentElement);

UIkit.component('sortable', {

    mixins: [mixin.class],

    props: {
        group: String,
        animation: Number,
        threshold: Number,
        clsItem: String,
        clsPlaceholder: String,
        clsGhost: String,
        clsDragging: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String
    },

    defaults: {
        group: false,
        animation: 150,
        threshold: 10,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsGhost: 'uk-sortable-drag',
        clsDragging: 'uk-sortable-dragging',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false
    },

    ready() {

        this.$el.on(pointerDown, '> *', this.init);

        if (this.clsEmpty) {
            var empty = () => this.$el.toggleClass(this.clsEmpty, !this.$el.children().length);
            (new Observer(empty)).observe(this.$el[0], {childList: true});
            empty();
        }

    },

    methods: {

        init(e) {

            e.stopPropagation();
            e.preventDefault();

            var target = $(e.target);

            if (target.is(':input')
                || this.handle && !isWithin(target, this.handle)
                || e.button && e.button !== 0
                || isWithin(target, `.${this.clsNoDrag}`)
            ) {
                return;
            }

            this.touched = [this];
            this.element = $(e.currentTarget);

            var offset = this.element.offset(), pos = getPos(e);

            this.origin = extend({
                left: offset.left - pos.x,
                top: offset.top - pos.y,
                index: this.element.index(),
                target: target
            }, pos);

            doc.on(pointerMove, this.move);
            doc.on(pointerUp, this.end);

            if (this.handle) {
                this.start(e);
            }

        },

        start(e) {

            this.ghost = $(`<div class="${`${this.clsGhost} ${this.clsCustom}`}"></div>`)
                .css({
                    width: this.element.width(),
                    height: this.element.height(),
                    padding: this.element.css('padding')
                })
                .append(this.element.html()).appendTo('body');

            this.element.addClass(this.clsPlaceholder);
            this.$el.children().addClass(this.clsItem);
            doc.addClass(this.clsDragging);

            this.$el.trigger('start', [this, this.element, this.ghost]);

            this.move(e);
        },

        move(e) {

            var pos = getPos(e);

            if (!this.ghost) {

                if (Math.abs(pos.x - this.origin.x) > this.threshold || Math.abs(pos.y - this.origin.y) > this.threshold) {
                    this.start(e);
                }

                return;
            }

            var top = pos.y + this.origin.top,
                height = this.ghost.height() / 3,
                scroll = win.scrollTop();

            this.ghost.offset({top, left: pos.x + this.origin.left});

            // TODO make smooth
            if (top + height <= document.body.offsetHeight) {
                if (top < scroll) {
                    win.scrollTop(scroll - height);
                } else if (top + height > window.innerHeight + scroll) {
                    win.scrollTop(scroll + height);
                }
            }

            var target = e.type === 'mousemove' ? e.target : elementFromPoint(e),
                sortable = getSortable(target),
                previous = getSortable(this.element[0]);

            if (!sortable || sortable !== previous && (!sortable.group || sortable.group !== previous.group)) {
                return;
            }

            if (this.touched.indexOf(sortable) === -1) {
                this.touched.push(sortable);
            }

            if (sortable !== previous) {
                sortable.$el.children().addClass(this.clsItem);
            }

            target = $(target).closest(`.${sortable.clsItem}`);

            if (target.length && !this.element.is(target)) {
                insert(this.element, target, this.animation).then(() => {
                    sortable.$updateParents();
                    if (sortable !== previous) {
                        previous.$updateParents();
                    }
                });
            } else if (sortable !== previous) {
                sortable.$el.append(this.element);
            }

        },

        end(e) {

            doc.off(pointerMove, this.move);
            doc.off(pointerUp, this.end);

            var pos = getPos(e);
            if (isWithin(this.origin.target[0], 'a[href]') && e.type !== 'mouseup' && pos.x === this.origin.x && pos.y === this.origin.y) {
                location.href = this.origin.target.closest('a[href]').attr('href');
            }

            if (!this.ghost) {
                return;
            }

            var sortable = getSortable(this.element[0]);

            if (this === sortable) {
                if (this.origin.index !== this.element.index()) {
                    this.$el.trigger('change', [this, this.element, 'moved']);
                }
            } else {
                sortable.$el.trigger('change', [sortable, this.element, 'added']);
                this.$el.trigger('change', [this, this.element, 'removed']);
            }

            this.$el.trigger('stop', [this]);

            this.ghost.remove();
            this.ghost = null;

            this.touched.forEach(sortable => sortable.$el.children().removeClass(`${sortable.clsPlaceholder} ${sortable.clsItem}`));

            doc.removeClass(this.clsDragging);

        }

    }

});

function getSortable(element) {
    return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
}

function getPos(e) {
    var {pageX, pageY} = e.originalEvent.touches && e.originalEvent.touches[0] || e.originalEvent;
    return {x: pageX, y: pageY};
}

function elementFromPoint(e) {
    var {x, y} = getPos(e);
    return document.elementFromPoint(x - document.body.scrollLeft, y - document.body.scrollTop);
}

function insert(element, target, animation) {

    var targetList = target.parent(),
        elementList = element.parent(),
        before = !targetList.is(elementList) || element.prevAll().filter(target).length;

    if (!animation) {
        element[before ? 'insertBefore' : 'insertAfter'](target);
        return $.Deferred().resolve();
    }

    var children = targetList.children().toArray(),
        lists = targetList,
        reset = {position: '', minWidth: '', pointerEvents: '', top: '', left: ''};

    if (!targetList.is(elementList)) {
        lists = lists.add(elementList);
        children = children.concat(elementList.children().toArray());
    }

    children = children.map(el => $(el));

    var props = children.map(el => extend({position: 'absolute', pointerEvents: 'none', minWidth: el.width()}, el.position()));

    children.forEach(el => el.css(reset));

    element[before ? 'insertBefore' : 'insertAfter'](target);

    lists.each((_, list) => {
        getSortable(list).$updateParents();
        $(list).css('min-height', $(list).height());
    });

    var positions = children.map(el => el.position()), promises = [];

    children.forEach((el, i) => {
        let def = $.Deferred();
        el.css(props[i]).animate(positions[i], animation, () => {
            el.css(reset);
            def.resolve();
        });
        promises.push(def);
    });

    return $.when.apply($, promises).then(() => targetList.add(elementList).css('min-height', ''));

}
