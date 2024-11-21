import {
    addClass,
    css,
    hasClass,
    isRtl,
    scrolledOver,
    sumBy,
    toFloat,
    toggleClass,
    toPx,
} from 'uikit-util';
import { scroll } from '../api/observables';
import Class from '../mixin/class';
import Margin from './margin';

export default {
    extends: Margin,

    mixins: [Class],

    name: 'grid',

    props: {
        masonry: Boolean,
        parallax: String,
        parallaxStart: String,
        parallaxEnd: String,
        parallaxJustify: Boolean,
    },

    data: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
        masonry: false,
        parallax: 0,
        parallaxStart: 0,
        parallaxEnd: 0,
        parallaxJustify: false,
    },

    connected() {
        this.masonry && addClass(this.$el, 'uk-flex-top', 'uk-flex-wrap-top');
    },

    observe: scroll({ filter: ({ parallax, parallaxJustify }) => parallax || parallaxJustify }),

    update: [
        {
            write({ rows }) {
                toggleClass(this.$el, this.clsStack, !rows.some((row) => row.length > 1));
            },

            events: ['resize'],
        },

        {
            read(data) {
                const { rows } = data;
                let { masonry, parallax, parallaxJustify, margin } = this;

                parallax = Math.max(0, toPx(parallax));

                // Filter component makes elements positioned absolute
                if (
                    !(masonry || parallax || parallaxJustify) ||
                    positionedAbsolute(rows) ||
                    rows[0].some((el, i) =>
                        rows.some((row) => row[i] && row[i].offsetWidth !== el.offsetWidth),
                    )
                ) {
                    return (data.translates = data.scrollColumns = false);
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
                    (column) => sumBy(column, 'offsetHeight') + gutter * (column.length - 1),
                );
                const height = Math.max(0, ...columnHeights);

                let scrollColumns;
                let parallaxStart;
                let parallaxEnd;
                if (parallax || parallaxJustify) {
                    scrollColumns = columnHeights.map((hgt, i) =>
                        parallaxJustify ? height - hgt + parallax : parallax / (i % 2 || 8),
                    );
                    if (!parallaxJustify) {
                        parallax = Math.max(
                            ...columnHeights.map((hgt, i) => hgt + scrollColumns[i] - height),
                        );
                    }
                    parallaxStart = toPx(this.parallaxStart, 'height', this.$el, true);
                    parallaxEnd = toPx(this.parallaxEnd, 'height', this.$el, true);
                }

                return {
                    columns,
                    translates,
                    scrollColumns,
                    parallaxStart,
                    parallaxEnd,
                    padding: parallax,
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
            read({ rows, scrollColumns, parallaxStart, parallaxEnd }) {
                return {
                    scrolled:
                        scrollColumns && !positionedAbsolute(rows)
                            ? scrolledOver(this.$el, parallaxStart, parallaxEnd)
                            : false,
                };
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
                    }),
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
            row.reverse();
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
