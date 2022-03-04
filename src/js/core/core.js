import { css, fastdom, inBrowser, observeResize, on, toMs } from 'uikit-util';

export default function (UIkit) {
    if (!inBrowser) {
        return;
    }

    // throttle 'resize'
    let pendingResize;
    const handleResize = () => {
        if (pendingResize) {
            return;
        }
        pendingResize = true;
        fastdom.read(() => (pendingResize = false));
        UIkit.update(null, 'resize');
    };

    on(window, 'load resize', handleResize);
    on(document, 'loadedmetadata load', handleResize, true);
    observeResize(document.documentElement, handleResize);

    let started = 0;
    on(
        document,
        'animationstart',
        ({ target }) => {
            if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
                started++;
                css(document.documentElement, 'overflowX', 'hidden');
                setTimeout(() => {
                    if (!--started) {
                        css(document.documentElement, 'overflowX', '');
                    }
                }, toMs(css(target, 'animationDuration')) + 100);
            }
        },
        true
    );
}
