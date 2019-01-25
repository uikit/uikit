import {css, fastdom, on, ready, toMs} from 'uikit-util';

export default function (UIkit) {

    ready(() => {

        UIkit.update();

        let started = 0;

        on(window, 'load resize', e => UIkit.update(null, e));
        // throttle `scroll` event (Safari triggers multiple `scroll` events per frame)
        let pending;
        on(window, 'scroll', e => {

            if (pending) {
                return;
            }
            pending = true;
            fastdom.write(() => pending = false);

            const {target} = e;
            UIkit.update(target.nodeType !== 1 ? document.body : target, e.type);
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
