import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        update: {

            handler() {

                if (this.$el[0].offsetHeight === 0) {
                    return;
                }

                var columns = this.$el.children()
                        .filter((i, el) => el.offsetHeight > 0)
                        .removeClass(this.margin)
                        .removeClass(this.firstColumn),
                    rows = [[columns.eq(0)]];

                columns.slice(1).each((i, el) => {

                    el = $(el);

                    var top = el.offset().top, bottom = top + el.outerHeight(true);

                    for (var index = 0; index < rows.length; index++) {
                        var row = rows[index], offset = row[0].offset();

                        if (bottom <= offset.top) {
                            rows.splice(index, 0, [el]);
                            break;
                        }

                        if (top < offset.top + row[0].outerHeight(true)) {
                            row.push(el);
                            break;
                        }

                        if (rows.length === index + 1) {
                            rows.push([el]);
                            break;
                        }

                    }

                });

                rows.forEach((row, i) => {
                    row.sort((a, b) => a[0].offsetLeft - b[0].offsetLeft).forEach((el, j) => {
                       el.toggleClass(this.margin, i !== 0);
                       el.toggleClass(this.firstColumn, j === 0)
                   });
                });

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
