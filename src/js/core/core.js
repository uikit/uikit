import {css, on, ready, toMs} from 'uikit-util';

export default function (UIkit) {

    ready(() => {

        UIkit.update();

        let scroll = 0;
        let started = 0;

        on(window, 'load resize', e => UIkit.update(null, e));
        on(window, 'scroll', e => {
            const {target} = e;
            e.dir = scroll <= window.pageYOffset ? 'down' : 'up';
            e.pageYOffset = scroll = window.pageYOffset;
            UIkit.update(target.nodeType !== 1 ? document.body : target, e);
        }, {passive: true, capture: true});
        on(document, 'loadedmetadata load', ({target}) => UIkit.update(target, 'load'), true);

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

    });

}
