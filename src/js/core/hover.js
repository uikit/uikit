import $ from 'jquery';

export default function (UIkit) {

    var html = $('html'),
        selectors = ['.uk-animation-toggle', '.uk-transition-toggle', '[uk-hover]'],
        cls = 'uk-hover',
        current,
        start = function () {
            if (current && current.length) {
                $(`.${cls}`).removeClass(cls);
            }

            current = $(this).addClass(cls);
        },
        end = function () {
            if (current && current.length) {
                current.not($(this).parents()).removeClass(cls);
            }
        };

        attach();

    Object.defineProperty(UIkit, 'hoverSelector', {

        get() {
            return selectors;
        },

        set(selector) {
            selectors.push(selector);
            attach();
        }

    });

    function attach () {
        html.off(start).on('mouseenter touchstart MSPointerDown pointerdown', selectors.join(','), start)
            .off(end).on('mouseleave touchend MSPointerUp pointerup', selectors.join(','), end);
    }
}
