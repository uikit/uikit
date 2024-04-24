import { children, isRtl, isVisible, offsetPosition, toggleClass } from 'uikit-util';
import { mutation, resize } from '../api/observables';

export default {
    props: {
        margin: String,
        firstColumn: Boolean,
    },

    data: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column',
    },

    observe: [
        mutation({
            options: {
                childList: true,
            },
        }),
        mutation({
            options: {
                attributes: true,
                attributeFilter: ['style'],
            },
            target: ({ $el }) => [$el, ...children($el)],
        }),
        resize({
            target: ({ $el }) => [$el, ...children($el)],
        }),
    ],

    update: {
        read() {
            return {
                rows: getRows(children(this.$el)),
            };
        },

        write({ rows }) {
            for (const row of rows) {
                for (const el of row) {
                    toggleClass(el, this.margin, rows[0] !== row);
                    toggleClass(el, this.firstColumn, row[isRtl ? row.length - 1 : 0] === el);
                }
            }
        },

        events: ['resize'],
    },
};

export function getRows(elements) {
    const sorted = [[]];
    const withOffset = elements.some(
        (el, i) => i && elements[i - 1].offsetParent !== el.offsetParent,
    );

    for (const el of elements) {
        if (!isVisible(el)) {
            continue;
        }

        const offset = getOffset(el, withOffset);

        for (let i = sorted.length - 1; i >= 0; i--) {
            const current = sorted[i];

            if (!current[0]) {
                current.push(el);
                break;
            }

            const offsetCurrent = getOffset(current[0], withOffset);

            if (offset.top >= offsetCurrent.bottom - 1 && offset.top !== offsetCurrent.top) {
                sorted.push([el]);
                break;
            }

            if (offset.bottom - 1 > offsetCurrent.top || offset.top === offsetCurrent.top) {
                let j = current.length - 1;
                for (; j >= 0; j--) {
                    const offsetCurrent = getOffset(current[j], withOffset);
                    if (offset.left >= offsetCurrent.left) {
                        break;
                    }
                }
                current.splice(j + 1, 0, el);
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
