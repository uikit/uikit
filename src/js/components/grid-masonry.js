import { $$, append, doc, remove } from '../util/index';

export default function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('grid-masonry', {

        ready() {
            this.$el.style.gridAutoRows = '1px';
        },

        update: {
            write(data) {
                // return;
                const nw = this.$el.offsetWidth;
                const computed = getComputedStyle(this.$el);
                const rowHeight = parseInt(computed.getPropertyValue('grid-auto-rows'));
                const rowGap = parseInt(computed.getPropertyValue('grid-row-gap'));
                const colGap = parseInt(computed.getPropertyValue('grid-column-gap'));
                if (data.w !== nw || rowHeight !== data.rowHeight) {
                    data.w = nw;
                    data.rowHeight = rowHeight;
                    const fullRowHeight = rowHeight + rowGap;
                    $$('> *', this.$el).forEach(el => {
                        // const tmp = doc.createElement('div');
                        // append(tmp, el);
                        // append(this.$el, tmp);
                        const contentHeight = el.firstChild.offsetHeight + colGap;
                        el.style.gridRowEnd = `span ${Math.ceil(contentHeight / fullRowHeight)}`;
                        if (!rowGap) {
                            el.firstChild.style.marginBottom = `${colGap}px`;
                        }
                        // append(this.$el, el);
                        // remove(tmp);
                    });
                }
            },
            events: ['load', 'resize']
        }

    });
}
