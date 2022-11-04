import Resize from '../mixin/resize';
import {
    isRtl,
    isVisible,
    observeMutation,
    offsetPosition,
    toArray,
    toggleClass,
} from 'uikit-util';

export default {
    mixins: [Resize],

    props: {
        margin: String,
        firstColumn: Boolean,
    },

    data: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column',
    },

    resizeTargets() {
        return [this.$el, ...toArray(this.$el.children)];
    },

    connected() {
        this.registerObserver(
            observeMutation(this.$el, () => this.$reset(), {
                childList: true,
                attributes: true,
                attributeFilter: ['style'],
            })
        );
    },

    update: {
        read() {
            const rows = getRows(this.$el.children);

            return {
                rows,
                columns: getColumns(rows),
            };
        },

        write({ columns, rows }) {
            for (const row of rows) {
                for (const column of row) {
                    toggleClass(column, this.margin, rows[0] !== row);
                    toggleClass(column, this.firstColumn, columns[0].includes(column));
                }
            }
        },

        events: ['resize'],
    },
};

export function getRows(items) {
    return sortBy(items, 'top', 'bottom');
}

function getColumns(rows) {
    const columns = [];

    for (const row of rows) {
        const sorted = sortBy(row, 'left', 'right');
        for (let j = 0; j < sorted.length; j++) {
            columns[j] = columns[j] ? columns[j].concat(sorted[j]) : sorted[j];
        }
    }

    return isRtl ? columns.reverse() : columns;
}

function sortBy(items, startProp, endProp) {
    const sorted = [[]];

    for (const el of items) {
        if (!isVisible(el)) {
            continue;
        }

        let dim = getOffset(el);

        for (let i = sorted.length - 1; i >= 0; i--) {
            const current = sorted[i];

            if (!current[0]) {
                current.push(el);
                break;
            }

            let startDim;
            if (current[0].offsetParent === el.offsetParent) {
                startDim = getOffset(current[0]);
            } else {
                dim = getOffset(el, true);
                startDim = getOffset(current[0], true);
            }

            if (dim[startProp] >= startDim[endProp] - 1 && dim[startProp] !== startDim[startProp]) {
                sorted.push([el]);
                break;
            }

            if (dim[endProp] - 1 > startDim[startProp] || dim[startProp] === startDim[startProp]) {
                current.push(el);
                break;
            }

            if (i === 0) {
                sorted.unshift([el]);
                break;
            }
        }
    }

    return sorted;
}

function getOffset(element, offset = false) {
    let { offsetTop, offsetLeft, offsetHeight, offsetWidth } = element;

    if (offset) {
        [offsetTop, offsetLeft] = offsetPosition(element);
    }

    return {
        top: offsetTop,
        left: offsetLeft,
        bottom: offsetTop + offsetHeight,
        right: offsetLeft + offsetWidth,
    };
}
