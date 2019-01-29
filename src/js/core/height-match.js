import FlexBug from '../mixin/flex-bug';
import {getRows} from './margin';
import {$$, boxModelAdjust, css, offset, toFloat} from 'uikit-util';

export default {

    mixins: [FlexBug],

    args: 'target',

    props: {
        target: String,
        row: Boolean
    },

    data: {
        target: '> *',
        row: true,
        forceHeight: true
    },

    computed: {

        elements({target}, $el) {
            return $$(target, $el);
        }

    },

    update: {

        read() {
            return {
                rows: (this.row ? getRows(this.elements) : [this.elements]).map(match)
            };
        },

        write({rows}) {
            rows.forEach(({heights, elements}) =>
                elements.forEach((el, i) =>
                    css(el, 'minHeight', heights[i])
                )
            );
        },

        events: ['resize']

    }

};

function match(elements) {

    if (elements.length < 2) {
        return {heights: [''], elements};
    }

    let {heights, max} = getHeights(elements);
    const hasMinHeight = elements.some(el => el.style.minHeight);
    const hasShrunk = elements.some((el, i) => !el.style.minHeight && heights[i] < max);

    if (hasMinHeight && hasShrunk) {
        css(elements, 'minHeight', '');
        ({heights, max} = getHeights(elements));
    }

    heights = elements.map((el, i) =>
        heights[i] === max && toFloat(el.style.minHeight).toFixed(2) !== max.toFixed(2) ? '' : max
    );

    return {heights, elements};
}

function getHeights(elements) {
    const heights = elements.map(el => offset(el).height - boxModelAdjust('height', el, 'content-box'));
    const max = Math.max.apply(null, heights);

    return {heights, max};
}
