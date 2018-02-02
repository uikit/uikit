import {$$, addClass, css, doc, hasTouch, on, ready, removeClass, toMs, win, within} from '../util/index';

export default function (UIkit) {

    ready(() => {

        let scroll = 0;
        let started = 0;

        on(win, 'load resize', UIkit.update);
        on(win, 'scroll', e => {
            e.dir = scroll <= win.pageYOffset ? 'down' : 'up';
            e.scrollY = scroll = win.pageYOffset;
            UIkit.update(e);
        });

        on(doc, 'animationstart', ({target}) => {
            if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
                started++;
                doc.body.style.overflowX = 'hidden';
                setTimeout(() => {
                    if (!--started) {
                        doc.body.style.overflowX = '';
                    }
                }, toMs(css(target, 'animationDuration')) + 100);
            }
        }, true);

        if (!hasTouch) {
            return;
        }

        const cls = 'uk-hover';

        on(doc, 'tap', ({target}) =>
            $$(`.${cls}`).forEach(el =>
                !within(target, el) && removeClass(el, cls)
            )
        );

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {
                on(doc, 'tap', selector, ({current}) => addClass(current, cls));
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}
