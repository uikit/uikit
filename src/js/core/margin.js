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
                        .filter((_, el) => el.offsetHeight > 0)
                        .removeClass(this.margin)
                        .removeClass(this.firstColumn),
                    rows = [[columns.eq(0)]];

                columns.slice(1).each((_, el) => {

                    el = $(el);

                    var top = Math.ceil(el.offset().top), bottom = top + el.outerHeight(true);

                    for (var index = rows.length - 1; index >= 0; index--) {
                        var row = rows[index],
                            rowTop = Math.ceil(row[0].offset().top),
                            rowBottom = rowTop + row[0].outerHeight(true);

                        if (top >= rowBottom) {
                            rows.push([el]);
                            break;
                        }

                        if (bottom > rowTop) {
                            row.push(el);
                            break;
                        }

                        if (index === 0) {
                            rows.splice(index, 0, [el]);
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
