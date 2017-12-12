import { getStyles } from '../util/index';

export default {

    attrs: true,

    props: {
        masonry: Boolean
    },

    defaults: {
        masonry: false
    },

    update: {
        write(data) {

            for (var j = 0; j < this.$el.children.length; j++) {
                const el = this.$el.children[j].firstChild;
                if (el && el.style) {
                    el.style.marginTop = '';
                }
            }

            if (!this.masonry) {
                return;
            }

            const columns = {};
            var gapSize = -1;

            for (var i = 0; i < this.$el.children.length; i++) {

                const el = this.$el.children[i].firstChild;
                const bounds = el.getBoundingClientRect();
                const x = bounds.left;
                const columnY = columns[x];
                if (columnY) {
                    if (gapSize === -1) {

                        const cptStyle = getStyles(el.parentNode);
                        const val = cptStyle.getPropertyValue('margin-top');
                        gapSize = parseInt(val);
                    }
                    const offset = columnY - bounds.y + gapSize;
                    el.style.marginTop = `${offset}px`;
                    columns[x] += bounds.height + gapSize;
                } else {
                    columns[x] = bounds.bottom;
                }

                // }
            }

        },
        events: ['load', 'resize']
    }
};

// export default function plugin(UIkit) {

//     if (plugin.installed) {
//         return;
//     }

//     UIkit.component('grid-masonry', UIkit.components.grid.extend({

//         mixins: [mixin],

//         defaults: {
//             masonry: true
//         },

//         init() {
//             addClass(this.$el, 'uk-grid');
//         }

//     })
// );

// }
