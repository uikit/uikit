import { $, docElement as doc, hasTouch, isWithin, ready } from '../util/index';

export default function (UIkit) {

    ready(() => {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        doc.on('tap', ({target}) => $(`.${cls}`).filter((_, el) => !isWithin(target, el)).removeClass(cls));

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {
                doc.on('tap', selector, ({currentTarget}) => currentTarget.classList.add(cls));
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}
