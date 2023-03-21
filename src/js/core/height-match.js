import { getRows } from './margin';
import { resize } from '../api/observables';
import { $$, boxModelAdjust, css, dimensions, isVisible, pick } from 'uikit-util';

export default {
    args: 'target',

    props: {
        target: String,
        row: Boolean,
    },

    data: {
        target: '> *',
        row: true,
    },

    computed: {
        elements({ target }, $el) {
            return $$(target, $el);
        },
    },

    observe: resize({
        target: ({ $el, elements }) => [$el, ...elements],
    }),

    update: {
        read() {
            return {
                rows: (this.row ? getRows(this.elements) : [this.elements]).map(match),
            };
        },

        write({ rows }) {
            for (const { heights, elements } of rows) {
                elements.forEach((el, i) => css(el, 'minHeight', heights[i]));
            }
        },

        events: ['resize'],
    },
};

function match(elements) {
    if (elements.length < 2) {
        return { heights: [''], elements };
    }

    let heights = elements.map(getHeight);
    const max = Math.max(...heights);

    return {
        heights: elements.map((el, i) => (heights[i].toFixed(2) === max.toFixed(2) ? '' : max)),
        elements,
    };
}

function getHeight(element) {
    const style = pick(element.style, ['display', 'minHeight']);

    if (!isVisible(element)) {
        css(element, 'display', 'block', 'important');
    }
    css(element, 'minHeight', '');
    const height = dimensions(element).height - boxModelAdjust(element, 'height', 'content-box');
    css(element, style);
    return height;
}
