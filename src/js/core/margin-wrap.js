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

                var columns = this.$el.removeClass(this.margin).children().filter((i, el) => { return el.style.display !== 'none'; }), offset = false, pos = false;

                sortByOffset(columns, 'top').filter((i, el) => {

                    el = $(el);

                    if (offset === false) {
                        offset = el.offset().top + columns.outerHeight() - 1; // (-1): weird firefox bug when parent container is display:flex
                        return;
                    }

                    return el.offset().top >= offset;

                }).addClass(this.margin);

                if (!this.rowFirst) {
                    return;
                }

                // Mark first column elements
                sortByOffset(columns.removeClass(this.rowFirst), 'left').filter((i, el) => {

                    el = $(el);

                    if (pos === false) {
                        pos = el.offset().left;
                    }

                    return pos === el.offset().left;

                }).addClass(this.rowFirst);
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}

function sortByOffset(elements, prop) {
    return elements.sort((a, b) => {
        a = $(a).offset[prop];
        b = $(b).offset[prop];

        return a === b ? 0 : a < b ? -1 : 1;
    });
}
