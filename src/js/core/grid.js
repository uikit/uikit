import { Class } from '../mixin/index';
import { addClass, css, getStyles, scrolledOver, toFloat, toggleClass } from '../util/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        attrs: true,

        name: 'grid',

        props: {
            masonry: Boolean,
            target: String,
            translate: Number
        },

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack',
            masonry: false,
            target: false,
            translate: 0

        },

        computed: {

            translate({translate}) {
                return Math.abs(translate);
            }

        },

        init() {
            addClass(this.$el, 'uk-grid');
        },

        disconnected() {
            this.reset();
            css(this.$el, 'marginBottom', '');
        },

        methods: {
            reset() {
                css(this.$el.children, 'transform', '');
            }
        },

        update: [
            {
                
                read({rows}) {
                    return {
                        columns: rows && rows[0] && rows[0].length || 0,
                        rows: rows && rows.map(elements => sortBy(elements, 'offsetLeft'))
                    };
                },

                write({columns}) {
                    css(this.$el, 'marginBottom', columns > 1
                        ? this.translate + toFloat(css(css(this.$el, 'marginBottom', ''), 'marginBottom'))
                        : '');
                },

                events: ['load', 'resize']
            },

            {

                read() {
                    return {scrolled: scrolledOver(this.$el) * this.translate};
                },

                write({rows, columns, scrolled}) {

                    if (!rows || columns === 1 || !scrolled) {
                        return this.reset();
                    }

                    rows.forEach(row =>
                        row.forEach((el, i) =>
                            css(el, 'transform', `translateY(${i % 2 ? scrolled : scrolled / 8}px)`)
                        )
                    );

                },

                events: ['scroll', 'load', 'resize']
            },
            {
                write(data) {
                    for (var j = 0; j < this.$el.children.length; j++) {
                        const el = this.$el.children[j].firstChild;
                        if (el && el.style) {
                            el.style.marginTop = '';
                        }
                    }

                    if (!this.masonry) {
                        return;
                    }

                    const columns = {};
                    var gapSize = -1;

                    for (var i = 0; i < this.$el.children.length; i++) {

                        const el = this.$el.children[i].firstChild;
                        const bounds = el.getBoundingClientRect();
                        const x = bounds.left;
                        const columnY = columns[x];
                        if (columnY) {
                            if (gapSize === -1) {

                                const cptStyle = getStyles(el.parentNode);
                                const val = cptStyle.getPropertyValue('margin-top');
                                gapSize = parseInt(val);
                            }
                            const offset = columnY - bounds.y + gapSize;
                            el.style.marginTop = `${offset}px`;
                            columns[x] += bounds.height + gapSize;
                        } else {
                            columns[x] = bounds.bottom;
                        }

                    }
                },

                events: ['load', 'resize']
            },
            {

                write(data) {
                    toggleClass(this.$el, this.clsStack, data.stacks);
                },

                events: ['load', 'resize']

            }
        ]

    }));

    UIkit.component('grid').options.update.unshift({

        read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

    function sortBy(collection, prop) {
        return collection.sort((a, b) =>
            a[prop] > b[prop]
                ? 1
                : b[prop] > a[prop]
                    ? -1
                    : 0
        );
    }

}
