import {isRtl, isVisible, toggleClass} from 'uikit-util';

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

        read(data) {

            const items = this.$el.children;
            const rows = [[]];

            if (!items.length || !isVisible(this.$el)) {
                return data.rows = rows;
            }

            data.rows = getRows(items);
            data.stacks = !data.rows.some(row => row.length > 1);

        },

        write({rows}) {

            rows.forEach((row, i) =>
                row.forEach((el, j) => {
                    toggleClass(el, this.margin, i !== 0);
                    toggleClass(el, this.firstColumn, j === 0);
                })
            );

        },

        events: ['load', 'resize']

    }

};

export function getRows(items) {
    const rows = [[]];

    for (let i = 0; i < items.length; i++) {

        const el = items[i];
        const dim = getOffset(el);

        if (!dim.height) {
            continue;
        }

        for (let j = rows.length - 1; j >= 0; j--) {

            const row = rows[j];

            if (!row[0]) {
                row.push(el);
                break;
            }

            const leftDim = getOffset(row[0]);

            if (dim.top >= leftDim.bottom - 1) {
                rows.push([el]);
                break;
            }

            if (dim.bottom > leftDim.top) {

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

function getOffset(element) {

    const {offsetTop, offsetLeft, offsetHeight} = element;

    return {
        top: offsetTop,
        left: offsetLeft,
        height: offsetHeight,
        bottom: offsetTop + offsetHeight
    };
}
