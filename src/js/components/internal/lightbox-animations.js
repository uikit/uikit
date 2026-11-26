import Animations from '../../mixin/internal/slideshow-animations';
import { opacityPercent, scale3d } from './slideshow-animations';

export default {
    ...Animations,
    fade: {
        percent: opacityPercent,

        translate: (percent) => [{ opacity: 1 - percent }, { opacity: percent }],
    },

    scale: {
        percent: opacityPercent,

        translate: (percent) => [
            { opacity: 1 - percent, transform: scale3d(1 - 0.2 * percent) },
            { opacity: percent, transform: scale3d(1 - 0.2 + 0.2 * percent) },
        ],
    },
};
