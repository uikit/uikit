function getPx(unit) {
    return parseInt(unit, 10) || 0;
}

var uniqueIdCounter = 0;

var S = {
    classes: {
        plugin: 'fixedsticky',
        active: 'fixedsticky-on',
        inactive: 'fixedsticky-off',
        clone: 'fixedsticky-dummy',
        withoutFixedFixed: 'fixedsticky-withoutfixedfixed'
    },
    keys: {
        offset: 'fixedStickyOffset',
        position: 'fixedStickyPosition',
        id: 'fixedStickyId'
    },
    tests: {
        sticky: featureTest('position', 'sticky'),
        fixed: featureTest('position', 'fixed', true)
    },
    // Thanks jQuery!
    getScrollTop: function () {
        var prop = 'pageYOffset',
            method = 'scrollTop';
        return win ? (prop in win) ? win[prop] :
            win.document.documentElement[method] :
            win.document.body[method];
    },
    update: function (el) {
        if (!el.offsetWidth) {
            return;
        }

        var $el = $(el),
            height = $el.outerHeight(),
            initialOffset = $el.data(S.keys.offset),
            scroll = S.getScrollTop(),
            isAlreadyOn = $el.is('.' + S.classes.active),
            toggle = function (turnOn) {
                $el[turnOn ? 'addClass' : 'removeClass'](S.classes.active)
                    [!turnOn ? 'addClass' : 'removeClass'](S.classes.inactive);
            },
            viewportHeight = $(window).height(),
            position = $el.data(S.keys.position),
            skipSettingToFixed,
            elTop,
            elBottom,
            $parent = $el.parent(),
            parentOffset = $parent.offset().top,
            parentHeight = $parent.outerHeight();

        if (initialOffset === undefined) {
            initialOffset = $el.offset().top;
            $el.data(S.keys.offset, initialOffset);
            $el.after($('<div>').addClass(S.classes.clone).height(height));
        }

        if (!position) {
            // Some browsers require fixed/absolute to report accurate top/left values.
            skipSettingToFixed = $el.css('top') !== 'auto' || $el.css('bottom') !== 'auto';

            if (!skipSettingToFixed) {
                $el.css('position', 'fixed');
            }

            position = {
                top: $el.css('top') !== 'auto',
                bottom: $el.css('bottom') !== 'auto'
            };

            if (!skipSettingToFixed) {
                $el.css('position', '');
            }

            $el.data(S.keys.position, position);
        }



        elTop = getPx($el.css('top'));
        elBottom = getPx($el.css('bottom'));

        if (position.top && isFixedToTop() || position.bottom && isFixedToBottom()) {
            if (!isAlreadyOn) {
                toggle(true);
            }
        } else {
            if (isAlreadyOn) {
                toggle(false);
            }
        }

        function isFixedToTop() {
            var offsetTop = scroll + elTop;

            // Initial Offset Top
            return initialOffset < offsetTop &&
                    // Container Bottom
                offsetTop + height <= parentOffset + parentHeight;
        }

        function isFixedToBottom() {
            // Initial Offset Top + Height
            return initialOffset + ( height || 0 ) > scroll + viewportHeight - elBottom &&
                    // Container Top
                scroll + viewportHeight - elBottom >= parentOffset + ( height || 0 );
        }
    },
    init: function (el) {
        var $el = $(el);

        return $el.each(function () {
            var _this = this;
            var id = uniqueIdCounter++;
            $(this).data(S.keys.id, id);

            $(win).bind('scroll.fixedsticky' + id, function () {
                S.update(_this);
            }).trigger('scroll.fixedsticky' + id);

            $(win).bind('resize.fixedsticky' + id, function () {
                if ($el.is('.' + S.classes.active)) {
                    S.update(_this);
                }
            });
        });
    }
};
