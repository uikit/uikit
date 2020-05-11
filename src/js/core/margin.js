import {includes, isRtl, isVisible, offsetPosition, toggleClass} from 'uikit-util';

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
            return {
                columns: getColumns(this.$el.children),
                rows: getRows(this.$el.children)
            };
        },

        write({columns, rows}) {
            rows.forEach((row, i) =>
                row.forEach(el => {
                    toggleClass(el, this.margin, i !== 0);
                    toggleClass(el, this.firstColumn, includes(columns[0], el));
                })
            );
        },

        events: ['resize']

    }

};

export function getRows(items) {
    return sortBy(items, 'top', 'bottom');
}

function getColumns(items) {
    const columns = sortBy(items, 'left', 'right');
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
