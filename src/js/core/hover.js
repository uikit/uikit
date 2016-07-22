import $ from 'jquery';
import { hasTouch, isWithin, ready } from '../util/index';

export default function (UIkit) {

    ready(() => {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover', html = $('html').on('tap', ({target}) => $(`.${cls}`).filter((_, el) => !isWithin(target, el)).removeClass(cls));

        Object.defineProperty(UIkit, 'hoverSelector', {

            set(selector) {

                html.on('tap', selector, function () {
                    this.classList.add(cls);
                });

            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

}


