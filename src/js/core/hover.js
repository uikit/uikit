import { $, addClass, contains, doc, hasTouch, on, ready } from '../util/index';

export default function (UIkit) {

    ready(() => {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        on(doc, 'tap', ({target}) => $(`.${cls}`).filter((_, el) => !contains(target, el)).removeClass(cls));

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {
                on(doc, 'tap', selector, ({current}) => addClass(current, cls));
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}
