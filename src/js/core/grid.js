import $ from 'jquery';
import domMixin from '../mixin/dom';

export default function (UIkit) {

    UIkit.component('grid', {

        mixins: [domMixin],

        props: ['margin', 'match', 'rowfirst'],

        defaults: {
            margin: 'uk-grid-margin',
            match: false,
            rowfirst: 'uk-grid-first'
        },

        ready() {
            this.check();
        },

        update: {
            handler() {
                this.check();
            },
            on: ['resize', 'orientationchange']
        },

        methods: {

            check() {

                this.columns = this.$el.children();

                if (this.match) this.matcher();
                if (this.margin) this.margins();

                if (!this.rowfirst) {
                    return this;
                }

                // Mark first column elements
                var pos_cache = this.columns.removeClass(this.rowfirst).filter(':visible').first().position();

                if (pos_cache) {
                    this.columns.each((i, column) => {
                        $(column)[$(column).position().left == pos_cache.left ? 'addClass' : 'removeClass'](this.rowfirst);
                    });
                }

                return this;
            },

            matcher() {

                if (this.match) {

                    var children = this.columns;
                    var firstvisible = children.filter(":visible:first");

                    if (!firstvisible.length) return;

                    var elements = this.match === true ? children : this.$find(this.match);
                    var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

                    if (stacked && !this.ignorestacked) {
                        elements.css('min-height', '');
                    } else {
                        this.matchHeights(elements);
                    }
                }

                return this;
            },

            margins() {

                if (this.margin) {
                    this.stackMargin(this.columns, {margin: this.margin});
                }

                return this;
            }
        }

    });

}
