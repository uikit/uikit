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
            return {rows: getRows(this.$el.children)};
        },

        write({rows}) {

            rows.forEach((row, i) =>
                row.forEach((el, j) => {
                    toggleClass(el, this.margin, i !== 0);
                    toggleClass(el, this.firstColumn, j === 0);
                })
            );

        },

        events: ['resize']

    }

};

export function getRows(items) {

    const rows = [[]];

    for (let i = 0; i < items.length; i++) {

        const el = items[i];

        if (!isVisible(el)) {
            continue;
        }

        let dim = getOffset(el);

        for (let j = rows.length - 1; j >= 0; j--) {

            const row = rows[j];

            if (!row[0]) {
                row.push(el);
                break;
            }

            let leftDim;
            if (row[0].offsetParent === el.offsetParent) {
                leftDim = getOffset(row[0]);
            } else {
                dim = getOffset(el, true);
                leftDim = getOffset(row[0], true);
            }

            if (dim.top >= leftDim.bottom - 1 && dim.top !== leftDim.top) {
                rows.push([el]);
                break;
            }

            if (dim.bottom > leftDim.top || dim.top === leftDim.top) {

                if (dim.left < leftDim.left && !isRtl) {
                    row.unshift(el);
                    break;
                }

                row.push(el);
                break;
            }

            if (j === 0) {
                rows.unshift([el]);
                break;
            }

        }

    }

    return rows;

}

function getOffset(element, offset = false) {

    let {offsetTop, offsetLeft, offsetHeight} = element;

    if (offset) {
        [offsetTop, offsetLeft] = offsetPosition(element);
    }

    return {
        top: offsetTop,
        left: offsetLeft,
        height: offsetHeight,
        bottom: offsetTop + offsetHeight
    };
}
