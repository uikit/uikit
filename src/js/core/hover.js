import { $, hasTouch, isWithin, on, ready } from '../util/index';

export default function (UIkit) {

    ready(() => {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        on(document, 'tap', ({target}) => $(`.${cls}`).filter((_, el) => !isWithin(target, el)).removeClass(cls));

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {
                on(document, 'tap', selector, ({current}) => current.classList.add(cls));
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}
