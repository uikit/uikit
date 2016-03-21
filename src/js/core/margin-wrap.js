import $ from 'jquery';
import {extend} from '../util/index';

export default function (UIkit) {

    UIkit.component('margin-wrap', {

        props: {
            margin: String,
            rowFirst: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            rowFirst: 'uk-row-first'
        },

        update: {

            handler() {

                if (this.$el[0].offsetHeight === 0) {
                    return;
                }

                var left = Number.MAX_VALUE,
                    top = Number.MAX_VALUE,
                    offset,
                    columns = this.$el.children()
                        .filter((i, el) => el.offsetHeight > 0)
                        .removeClass(this.margin)
                        .removeClass(this.rowFirst);

                columns
                    .each((i, el) => {
                        el = $(el);
                        offset = el.offset();
                        top = Math.min(top, offset.top + el.outerHeight(true) - 1); // (-1): weird firefox bug when parent container is display:flex
                        left = Math.min(left, offset.left + el.outerWidth(true));
                    })
                    .each((i, el) => {
                        el = $(el);
                        offset = el.offset();
                        el.toggleClass(this.margin, offset.top >= top);
                        el.toggleClass(this.rowFirst, this.rowFirst && offset.left === left);
                    });
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
