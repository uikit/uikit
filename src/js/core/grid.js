import Margin from './margin';
import Class from '../mixin/class';
import {addClass, css, hasClass, height as getHeight, scrolledOver, toFloat, toggleClass, toNodes, sortBy} from 'uikit-util';

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

    computed: {

        length(_, $el) {
            return $el.children.length;
        },

        parallax({parallax}) {
            return parallax && this.length ? Math.abs(parallax) : '';
        }

    },

    connected() {
        this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
    },

    update: [

        {

            read({rows}) {

                if (this.masonry || this.parallax) {
                    rows = rows.map(elements => sortBy(elements, 'offsetLeft'));
                }

                const hasStaticContent = rows.some(elements => elements.some(element => element.style.position === 'static'));
                let translates = false;
                let elHeight = '';

                if (this.masonry && this.length) {

                    let height = 0;

                    translates = rows.reduce((translates, row, i) => {

                        translates[i] = row.map((_, j) => i === 0 ? 0 : toFloat(translates[i - 1][j]) + (height - toFloat(rows[i - 1][j] && rows[i - 1][j].offsetHeight)));
                        height = row.reduce((height, el) => Math.max(height, el.offsetHeight), 0);

                        return translates;

                    }, []);

                    elHeight = maxColumnHeight(rows) + getMarginTop(this.$el, this.margin) * (rows.length - 1);

                }

                return {rows, translates, height: hasStaticContent ? elHeight : false};

            },

            write({stacks, height}) {

                toggleClass(this.$el, this.clsStack, stacks);

                css(this.$el, 'paddingBottom', this.parallax);
                height !== false && css(this.$el, 'height', height);

            },

            events: ['load', 'resize']

        },

        {

            read({height}) {
                return {
                    scrolled: this.parallax
                        ? scrolledOver(this.$el, height ? height - getHeight(this.$el) : 0) * this.parallax
                        : false
                };
            },

            write({rows, scrolled, translates}) {

                if (scrolled === false && !translates) {
                    return;
                }

                rows.forEach((row, i) =>
                    row.forEach((el, j) =>
                        css(el, 'transform', !scrolled && !translates ? '' : `translateY(${
                            (translates && -translates[i][j]) + (scrolled ? j % 2 ? scrolled : scrolled / 8 : 0)
                        }px)`)
                    )
                );

            },

            events: ['scroll', 'load', 'resize']

        }

    ]

};

function getMarginTop(root, cls) {

    const nodes = toNodes(root.children);
    const [node] = nodes.filter(el => hasClass(el, cls));

    return toFloat(node
        ? css(node, 'marginTop')
        : css(nodes[0], 'paddingLeft'));
}

function maxColumnHeight(rows) {
    return Math.max(...rows.reduce((sum, row) => {
        row.forEach((el, i) => sum[i] = (sum[i] || 0) + el.offsetHeight);
        return sum;
    }, []));
}
