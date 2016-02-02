import $ from 'jquery';
import {extend} from '../util/index';

export default {

    props: ['margin', 'rowFirst'],

    ready() {
        this.check();
    },

    update: {
        handler() {
            this.check();
        },
        on: ['resize', 'orientationchange', 'update']
    },

    methods: {

        check() {

            if (!this.$el.is(':visible')) {
                return this;
            }

            var columns = this.$el.children().removeClass(this.margin),
                skip = false,
                first = columns.filter(':visible:first'),
                offset = first.length ? (first.position().top + first.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

            if (offset !== false && columns.length > 1) {
                columns.each((i, column) => {

                    column = $(column);

                    if (column.is(':visible')) {

                        if (skip) {
                            column.addClass(this.margin);
                        } else if (column.position().top >= offset) {
                            skip = column.addClass(this.margin);
                        }

                    }

                });
            }

            if (this.rowFirst) {

                // Mark first column elements
                columns.removeClass(this.rowFirst);

                var pos = first.position();

                if (pos) {
                    columns.each((i, el) => {
                        $(el).toggleClass(this.rowFirst, $(el).position().left == pos.left);
                    });
                }
            }

            return this;
        }

    }

};
