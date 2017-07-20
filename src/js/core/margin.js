import { isRtl } from '../util/index';

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

        computed: {

            items() {
                return this.$el[0].children;
            }

        },

        update: {

            read() {

                if (!this.items.length || this.$el[0].offsetHeight === 0) {
                    this.rows = false;
                    return;
                }

                this.stacks = true;

                var rows = [[]];

                for (var i = 0; i < this.items.length; i++) {

                    var el = this.items[i],
                        dim = el.getBoundingClientRect();

                    if (!dim.height) {
                        continue;
                    }

                    for (var j = rows.length - 1; j >= 0; j--) {

                        var row = rows[j];

                        if (!row[0]) {
                            row.push(el);
                            break;
                        }

                        var leftDim = row[0].getBoundingClientRect();

                        if (dim.top >= Math.floor(leftDim.bottom)) {
                            rows.push([el]);
                            break;
                        }

                        if (Math.floor(dim.bottom) > leftDim.top) {

                            this.stacks = false;

                            if (dim.left < leftDim.left && !isRtl) {
                                row.unshift(el);
                                break;
                            }

                            row.push(el);
                            break;
                        }

                        if (j === 0) {
                            rows.unshift([el]);
                            break;
                        }

                    }

                }

                this.rows = rows;

            },

            write() {

                this.rows && this.rows.forEach((row, i) =>
                    row.forEach((el, j) => {
                        this.$toggleClass(el, this.margin, i !== 0);
                        this.$toggleClass(el, this.firstColumn, j === 0);
                    })
                )

            },

            events: ['load', 'resize']

        }

    });

}
