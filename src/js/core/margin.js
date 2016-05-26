import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-column-first'
        },

        update: {

            handler() {

                if (this.$el[0].offsetHeight === 0) {
                    return;
                }

                var offset,
                    top,
                    bottom,
                    columns = this.$el.children()
                        .filter((i, el) => el.offsetHeight > 0)
                        .removeClass(this.margin)
                        .removeClass(this.firstColumn),
                    rows = [[columns.eq(0)]];

                columns.slice(1).each((i, el) => {

                    el = $(el);
                    offset = el.offset();
                    top = offset.top;
                    bottom = offset.top + el.outerHeight(true);

                    for (var index = 0; index < rows.length; index++) {
                        var row = rows[index],
                            off = row[0].offset(),
                            after = offset.top >= off.top + row[0].outerHeight(true);

                        if (rows.length === index + 1 && after) {
                            rows.push([el]);
                            break;
                        }

                        if (bottom <= off.top) {
                            rows.unshift([el]);
                            break;
                        }

                        if (!after) {
                            row.push(el);
                            row = row.sort((a, b) => a[0].offsetLeft - b[0].offsetLeft);
                            break;
                        }
                    }

                });

                rows.forEach((row, i) => {
                   row.forEach((el, j) => {
                       el.toggleClass(this.margin, i !== 0);
                       el.toggleClass(this.firstColumn, j === 0)
                   });
                });

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
