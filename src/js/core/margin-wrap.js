import $ from 'jquery';
import {extend} from '../util/index';

export default function (UIkit) {

    UIkit.component('margin-wrap', {

        props: ['margin', 'rowFirst'],

        defaults: {
            margin: 'uk-margin-small-top',
            rowFirst: 'uk-row-first'
        },

        update: {

            handler() {

                if (!this.$el.is(':visible')) {
                    return this;
                }

                var skip = false, columns = this.$el.children(':visible').removeClass(this.margin),
                    offset = columns.length ? columns.position().top + columns.outerHeight() - 1 : false; // (-1): weird firefox bug when parent container is display:flex

                if (offset !== false && columns.length > 1) {
                    columns.slice(1).each((i, column) => {

                        column = $(column);

                        if (skip) {
                            column.addClass(this.margin);
                        } else if (column.position().top >= offset) {
                            skip = column.addClass(this.margin);
                        }

                    });
                }

                if (this.rowFirst) {

                    // Mark first column elements
                    columns.removeClass(this.rowFirst);

                    var pos = columns.first().position();

                    if (pos) {
                        columns.each((i, el) => {
                            $(el).toggleClass(this.rowFirst, $(el).position().left == pos.left);
                        });
                    }
                }

                return this;
            },

            events: ['load', 'ready', 'resize', 'orientationchange']

        }

    });

}
