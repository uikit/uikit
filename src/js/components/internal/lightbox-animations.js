import { css } from 'uikit-util';
import Animations from '../../mixin/internal/slideshow-animations';
import { scale3d } from './slideshow-animations';

export default {
    ...Animations,
    fade: {
        percent: (current) => 1 - css(current, 'opacity'),

        translate: (percent) => [{ opacity: 1 - percent }, { opacity: percent }],
    },

    scale: {
        percent: (current) => 1 - css(current, 'opacity'),

        translate: (percent) => [
            { opacity: 1 - percent, transform: scale3d(1 - 0.2 * percent) },
            { opacity: percent, transform: scale3d(1 - 0.2 + 0.2 * percent) },
        ],
    },
};
