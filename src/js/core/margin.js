import { $ } from '../util/index';

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

            read() {

                if (this.$el[0].offsetHeight === 0) {
                    this.hidden = true;
                    return;
                }

                this.hidden = false;
                this.stacks = true;

                var columns = this.$el.children().filter((_, el) => el.offsetHeight > 0);

                this.rows = [[columns.get(0)]];

                columns.slice(1).each((_, el) => {

                    var top = Math.ceil(el.offsetTop), bottom = top + el.offsetHeight;

                    for (var index = this.rows.length - 1; index >= 0; index--) {
                        var row = this.rows[index], rowTop = Math.ceil(row[0].offsetTop);

                        if (top >= rowTop + row[0].offsetHeight) {
                            this.rows.push([el]);
                            break;
                        }

                        if (bottom > rowTop) {

                            this.stacks = false;

                            if (el.offsetLeft < row[0].offsetLeft) {
                                row.unshift(el);
                                break;
                            }

                            row.push(el);
                            break;
                        }

                        if (index === 0) {
                            this.rows.splice(index, 0, [el]);
                            break;
                        }

                    }

                });

            },

            write() {

                if (this.hidden) {
                    return;
                }

                this.rows.forEach((row, i) =>
                    row.forEach((el, j) =>
                        $(el)
                            .toggleClass(this.margin, i !== 0)
                            .toggleClass(this.firstColumn, j === 0)
                    )
                )

            },

            events: ['load', 'resize']

        }

    });

}
