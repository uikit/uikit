import {isRtl, isVisible, offsetPosition, toggleClass} from 'uikit-util';

export default {

    props: {
        margin: String,
        firstColumn: Boolean
    },

    data: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column'
    },

    update: {

        read() {

            const rows = getRows(this.$el.children);

            return {
                rows,
                columns: getColumns(rows)
            };
        },

        write({columns, rows}) {
            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < rows[i].length; j++) {
                    toggleClass(rows[i][j], this.margin, i !== 0);
                    toggleClass(rows[i][j], this.firstColumn, !!~columns[0].indexOf(rows[i][j]));
                }
            }
        },

        events: ['resize']

    }

};

export function getRows(items) {
    return sortBy(items, 'top', 'bottom');
}

function getColumns(rows) {

    const columns = [];

    for (let i = 0; i < rows.length; i++) {
        const sorted = sortBy(rows[i], 'left', 'right');
        for (let j = 0; j < sorted.length; j++) {
            columns[j] = !columns[j] ? sorted[j] : columns[j].concat(sorted[j]);
        }
    }

    return isRtl
        ? columns.reverse()
        : columns;
}

function sortBy(items, startProp, endProp) {

    const sorted = [[]];

    for (let i = 0; i < items.length; i++) {

        const el = items[i];

        if (!isVisible(el)) {
            continue;
        }

        let dim = getOffset(el);

        for (let j = sorted.length - 1; j >= 0; j--) {

            const current = sorted[j];

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

            if (j === 0) {
                sorted.unshift([el]);
                break;
            }

        }

    }

    return sorted;
}

function getOffset(element, offset = false) {

    let {offsetTop, offsetLeft, offsetHeight, offsetWidth} = element;

    if (offset) {
        [offsetTop, offsetLeft] = offsetPosition(element);
    }

    return {
        top: offsetTop,
        left: offsetLeft,
        bottom: offsetTop + offsetHeight,
        right: offsetLeft + offsetWidth
    };
}
