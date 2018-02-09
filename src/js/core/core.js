import {$$, addClass, css, hasTouch, on, ready, removeClass, toMs, within} from '../util/index';

export default function (UIkit) {

    ready(() => {

        let scroll = 0;
        let started = 0;

        on(window, 'load resize', UIkit.update);
        on(window, 'scroll', e => {
            e.dir = scroll <= window.pageYOffset ? 'down' : 'up';
            e.scrollY = scroll = window.pageYOffset;
            UIkit.update(e);
        });

        on(document, 'animationstart', ({target}) => {
            if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {

                started++;
                css(document.body, 'overflowX', 'hidden');
                setTimeout(() => {
                    if (!--started) {
                        css(document.body, 'overflowX', '');
                    }
                }, toMs(css(target, 'animationDuration')) + 100);
            }
        }, true);

        if (!hasTouch) {
            return;
        }

        const cls = 'uk-hover';

        on(document, 'tap', ({target}) =>
            $$(`.${cls}`).forEach(el =>
                !within(target, el) && removeClass(el, cls)
            )
        );

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {
                on(document, 'tap', selector, ({current}) => addClass(current, cls));
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}
