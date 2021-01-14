import FlexBug from '../mixin/flex-bug';
import {getRows} from './margin';
import {$$, boxModelAdjust, css, dimensions, isVisible, toFloat} from 'uikit-util';

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

    let heights = elements.map(getHeight);
    let max = Math.max(...heights);
    const hasMinHeight = elements.some(el => el.style.minHeight);
    const hasShrunk = elements.some((el, i) => !el.style.minHeight && heights[i] < max);

    if (hasMinHeight && hasShrunk) {
        css(elements, 'minHeight', '');
        heights = elements.map(getHeight);
        max = Math.max(...heights);
    }

    heights = elements.map((el, i) =>
        heights[i] === max && toFloat(el.style.minHeight).toFixed(2) !== max.toFixed(2) ? '' : max
    );

    return {heights, elements};
}

function getHeight(element) {

    let style = false;
    if (!isVisible(element)) {
        style = element.style.display;
        css(element, 'display', 'block', 'important');
    }

    const height = dimensions(element).height - boxModelAdjust(element, 'height', 'content-box');

    if (style !== false) {
        css(element, 'display', style);
    }

    return height;
}
