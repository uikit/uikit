import { addClass, win } from '../util/index';

export default function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('grid-masonry', UIkit.components.grid.extend({

        init() {
            addClass(this.$el, 'uk-grid');
        },

        update: {
            write(data) {

                const currentWidth = this.$el.offsetWidth;
                if (data.width !== currentWidth) {
                    data.width = currentWidth;

                    const columns = {};
                    var gapSize = -1;
                    for (var i = 0; i < this.$el.children.length; i++) {

                        const el = this.$el.children[i].firstChild;
                        el.style.marginTop = '';
                        const bounds = el.getBoundingClientRect();
                        const x = bounds.left;
                        const columnY = columns[x];
                        if (columnY) {
                            if (gapSize === -1) {

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

    })
);

}
