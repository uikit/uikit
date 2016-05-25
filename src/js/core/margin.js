import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('margin', {

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
                        top = Math.min(top, offset.top + el.outerHeight(true) - 1);
                        left = Math.min(left, offset.left + el.outerWidth(true) - 1);
                    })
                    .each((i, el) => {
                        el = $(el);
                        offset = el.offset();
                        el.toggleClass(this.margin, offset.top >= top);
                        el.toggleClass(this.rowFirst, this.rowFirst && offset.left <= left);
                    });
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
