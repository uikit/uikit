import Margin from './margin';
import Class from '../mixin/class';
import {addClass, children, css, height as getHeight, hasClass, scrolledOver, sortBy, toFloat, toggleClass} from 'uikit-util';

export default {

    extends: Margin,

    mixins: [Class],

    name: 'grid',

    props: {
        masonry: Boolean,
        parallax: Number
    },

    data: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
        masonry: false,
        parallax: 0
    },

    connected() {
        this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
    },

    update: [

        {

            write({columns}) {
                toggleClass(this.$el, this.clsStack, columns.length < 2);
            },

            events: ['resize']

        },

        {

            read(data) {

                let {columns, rows} = data;

                // Filter component makes elements positioned absolute
                if (!columns.length || !this.masonry && !this.parallax || positionedAbsolute(this.$el)) {
                    data.translates = false;
                    return false;
                }

                let translates = false;

                const nodes = children(this.$el);
                const columnHeights = getColumnHeights(columns);
                const margin = getMarginTop(nodes, this.margin) * (rows.length - 1);
                const elHeight = Math.max(...columnHeights) + margin;

                if (this.masonry) {
                    columns = columns.map(column => sortBy(column, 'offsetTop'));
                    translates = getTranslates(rows, columns);
                }

                let padding = Math.abs(this.parallax);
                if (padding) {
                    padding = columnHeights.reduce((newPadding, hgt, i) =>
                            Math.max(newPadding, hgt + margin + (i % 2 ? padding : padding / 8) - elHeight)
                        , 0);
                }

                return {padding, columns, translates, height: translates ? elHeight : ''};

            },

            write({height, padding}) {

                css(this.$el, 'paddingBottom', padding || '');
                height !== false && css(this.$el, 'height', height);

            },

            events: ['resize']

        },

        {

            read({height}) {

                if (positionedAbsolute(this.$el)) {
                    return false;
                }

                return {
                    scrolled: this.parallax
                        ? scrolledOver(this.$el, height ? height - getHeight(this.$el) : 0) * Math.abs(this.parallax)
                        : false
                };
            },

            write({columns, scrolled, translates}) {

                if (scrolled === false && !translates) {
                    return;
                }

                columns.forEach((column, i) =>
                    column.forEach((el, j) =>
                        css(el, 'transform', !scrolled && !translates ? '' : `translateY(${
                            (translates && -translates[i][j]) + (scrolled ? i % 2 ? scrolled : scrolled / 8 : 0)
                        }px)`)
                    )
                );

            },

            events: ['scroll', 'resize']

        }

    ]

};

function positionedAbsolute(el) {
    return children(el).some(el => css(el, 'position') === 'absolute');
}

function getTranslates(rows, columns) {

    const rowHeights = rows.map(row =>
        Math.max(...row.map(el => el.offsetHeight))
    );

    return columns.map(elements => {
        let prev = 0;
        return elements.map((element, row) =>
            prev += row
                ? rowHeights[row - 1] - elements[row - 1].offsetHeight
                : 0
        );
    });
}

function getMarginTop(nodes, cls) {

    const [node] = nodes.filter(el => hasClass(el, cls));

    return toFloat(node
        ? css(node, 'marginTop')
        : css(nodes[0], 'paddingLeft'));
}

function getColumnHeights(columns) {
    return columns.map(column =>
        column.reduce((sum, el) => sum + el.offsetHeight, 0)
    );
}
