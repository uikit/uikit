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
                const nw = this.$el.offsetWidth;
                if (data.w !== nw) {
                    data.w = nw;
                    const computed = getComputedStyle(this.$el);
                    const rowHeight = parseInt(computed.getPropertyValue('grid-auto-rows'));
                    const rowGap = parseInt(computed.getPropertyValue('grid-row-gap'));
                    const fullRowHeight = rowHeight + rowGap;
                    $$('> *', this.$el).forEach(el => {
                        const tmp = doc.createElement('div');
                        append(tmp, el);
                        append(this.$el, tmp);
                        const contentHeight = el.offsetHeight;
                        el.style.gridRowEnd = `span ${contentHeight / fullRowHeight}`;
                        append(this.$el, el);
                        remove(tmp);
                    });
                }
            },
            events: ['load', 'resize']
        }

    });
}
