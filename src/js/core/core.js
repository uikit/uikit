import { css, inBrowser, on, toMs } from 'uikit-util';

export default function () {
    if (!inBrowser) {
        return;
    }

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
