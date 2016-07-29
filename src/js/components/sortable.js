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
        clsDrag: String,
        clsDragState: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String
    },

    defaults: {
        group: false,
        animation: 150,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
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

            var target = $(e.target);

            if (target.is(':input')
                || this.handle && !isWithin(target, this.handle)
                || e.button && e.button !== 0
                || isWithin(target, `.${this.clsNoDrag}`)
            ) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            this.touched = [this];
            this.element = $(e.currentTarget);

            this.origin = extend({
                target,
                index: this.element.index()
            }, getPos(e));

            doc.on(pointerMove, this.move);
            doc.on(pointerUp, this.end);

            if (!this.threshold) {
                this.start(e);
            }

        },

        start(e) {

            this.ghost = $(`<div class="${`${this.clsDrag} ${this.clsCustom}`}"></div>`)
                .css({
                    width: this.element.width(),
                    height: this.element.height(),
                    padding: this.element.css('padding')
                })
                .append(this.element.html()).appendTo('body');

            var {left, top} = this.element.offset(), {x, y} = getPos(e);
            extend(this.origin, {left: left - x, top: top - y});

            this.element.addClass(this.clsPlaceholder);
            this.$el.children().addClass(this.clsItem);
            doc.addClass(this.clsDragState);

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
            if (isWithin(this.origin.target, 'a[href]')) {
                if (pos.x !== this.origin.x || pos.y !== this.origin.y) {
                    $(e.target).one('click', e => e.preventDefault());
                } else if (e.type !== 'mouseup') {
                    location.href = this.origin.target.closest('a[href]').attr('href');
                }
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

            doc.removeClass(this.clsDragState);

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
        reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: ''};

    if (!targetList.is(elementList)) {
        lists = lists.add(elementList);
        children = children.concat(elementList.children().toArray());
    }

    children = children.map(el => $(el));

    var props = children.map(el => extend({position: 'absolute', pointerEvents: 'none', width: el.outerWidth(), height: el.outerHeight()}, el.position()));

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
