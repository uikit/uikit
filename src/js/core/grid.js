import { Class } from '../mixin/index';
import { $$, toggleClass, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        methods: {
            masonry() {

                if (this._data.rows.length > 1) {

                    const cptStyle = win.getComputedStyle(this._data.rows[1][0]);
                    const val = cptStyle.getPropertyValue('margin-top');
                    const gapSize = parseInt(val);

                    console.log(columns, this._data.rows);

                    this._data.rows.forEach(row => {
                        row.forEach(({firstChild: el}, column) => {
                            columns[column] = columns[column] || {data: []};
                            columns[column].data.push({el});
                            el.style.marginTop = '';

                        });
                    });

                    for (var row = 0 ; row < this._data.rows.length ; row++) {
                        Object.keys(columns).forEach(x => {
                            const column = columns[x];
                            const rowData = column.data[row];
                            if (rowData) {
                                rowData.bounds = rowData.el.getBoundingClientRect();
                                if (column.lastY) {
                                    const offset = column.lastY - rowData.bounds.y + gapSize;
                                    rowData.el.style.marginTop = `${offset}px`;
                                    column.lastY += rowData.bounds.height + gapSize;
                                } else {
                                    column.lastY = rowData.bounds.bottom;
                                }
                            }
                        });
                    }
                }
            }
        },

        update: {

            write(data) {

                toggleClass(this.$el, this.clsStack, data.stacks);

                const currentWidth = this.$el.offsetWidth;
                if (data.width !== currentWidth) {
                    data.width = currentWidth;

                    const columns = {};
                    var gapSize;
                    for (var i = 0; i < this.$el.children.length; i++) {

                        const el = this.$el.children[i].firstChild;
                        el.style.marginTop = '';
                        const bounds = el.getBoundingClientRect();
                        const x = bounds.left;
                        const columnY = columns[x];
                        if (columnY) {
                            if (!gapSize) {

                                const cptStyle = win.getComputedStyle(this._data.rows[1][0]);
                                const val = cptStyle.getPropertyValue('margin-top');
                                gapSize = parseInt(val);
                            }
                            const offset = columnY - bounds.y + gapSize;
                            el.style.marginTop = `${offset}px`;
                            columns[x] += bounds.height + gapSize;
                        } else {
                            columns[x] = bounds.bottom;
                        }

                    }
                }
            },

            events: ['load', 'resize']

        }

    }));

}
