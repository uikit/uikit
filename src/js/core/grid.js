import { scroll } from '../api/observables';
import Margin from './margin';
import Class from '../mixin/class';
import {
    addClass,
    css,
    hasClass,
    isRtl,
    scrolledOver,
    sumBy,
    toFloat,
    toggleClass,
} from 'uikit-util';

export default {
    extends: Margin,

    mixins: [Class],

    name: 'grid',

    props: {
        masonry: Boolean,
        parallax: Number,
        justifyColumns: Boolean,
    },

    data: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
        masonry: false,
        parallax: 0,
        justifyColumns: false,
    },

    connected() {
        this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
    },

    observe: scroll({ filter: ({ parallax }) => parallax }),

    update: [
        {
            write({ rows }) {
                toggleClass(this.$el, this.clsStack, !rows[0][1]);
            },

            events: ['resize'],
        },

        {
            read(data) {
                const { rows } = data;
                const { masonry, parallax, justifyColumns, margin } = this;

                // Filter component makes elements positioned absolute
                if (!rows[0][0] || (!masonry && !parallax) || positionedAbsolute(rows)) {
                    data.translates = false;
                    return false;
                }

                let gutter = getGutter(rows, margin);

                let columns;
                let translates;
                if (masonry) {
                    [columns, translates] = applyMasonry(rows, gutter, masonry === 'next');
                } else {
                    columns = transpose(rows);
                }

                const columnHeights = columns.map(
                    (column) => sumBy(column, 'offsetHeight') + gutter * (column.length - 1)
                );
                const height = Math.max(...columnHeights);

                let padding = Math.abs(parallax);
                let scrollColumns;
                if (padding) {
                    scrollColumns = columnHeights.map((hgt, i) =>
                        justifyColumns ? height - hgt + padding : padding / (i % 2 || 8)
                    );
                    if (!justifyColumns) {
                        padding = Math.max(
                            ...columnHeights.map((hgt, i) => hgt + scrollColumns[i] - height)
                        );
                    }
                }

                return {
                    columns,
                    padding,
                    translates,
                    scrollColumns,
                    height: translates ? height : '',
                };
            },

            write({ height, padding }) {
                css(this.$el, 'paddingBottom', padding || '');
                height !== false && css(this.$el, 'height', height);
            },

            events: ['resize'],
        },

        {
            read({ rows }) {
                if (this.parallax && positionedAbsolute(rows)) {
                    return false;
                }

                return { scrolled: this.parallax ? scrolledOver(this.$el) : false };
            },

            write({ columns, scrolled, scrollColumns, translates }) {
                if (!scrolled && !translates) {
                    return;
                }

                columns.forEach((column, i) =>
                    column.forEach((el, j) => {
                        let [x, y] = (translates && translates[i][j]) || [0, 0];

                        if (scrolled) {
                            y += scrolled * scrollColumns[i];
                        }

                        css(el, 'transform', `translate(${x}px, ${y}px)`);
                    })
                );
            },

            events: ['scroll', 'resize'],
        },
    ],
};

function positionedAbsolute(rows) {
    return rows.flat().some((el) => css(el, 'position') === 'absolute');
}

function applyMasonry(rows, gutter, next) {
    const columns = [];
    const translates = [];
    const columnHeights = Array(rows[0].length).fill(0);
    let rowHeights = 0;
    for (let row of rows) {
        if (isRtl) {
            row = row.reverse();
        }

        let height = 0;
        for (const j in row) {
            const { offsetWidth, offsetHeight } = row[j];
            const index = next ? j : columnHeights.indexOf(Math.min(...columnHeights));
            push(columns, index, row[j]);
            push(translates, index, [
                (index - j) * offsetWidth * (isRtl ? -1 : 1),
                columnHeights[index] - rowHeights,
            ]);
            columnHeights[index] += offsetHeight + gutter;
            height = Math.max(height, offsetHeight);
        }

        rowHeights += height + gutter;
    }

    return [columns, translates];
}

function getGutter(rows, cls) {
    const node = rows.flat().find((el) => hasClass(el, cls));
    return toFloat(node ? css(node, 'marginTop') : css(rows[0][0], 'paddingLeft'));
}

function transpose(rows) {
    const columns = [];
    for (const row of rows) {
        for (const i in row) {
            push(columns, i, row[i]);
        }
    }
    return columns;
}

function push(array, index, value) {
    if (!array[index]) {
        array[index] = [];
    }
    array[index].push(value);
}
