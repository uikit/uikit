import {toJQuery, Transition} from '../util/index';

export default function (UIkit) {

    UIkit.component('accordion', {

        mixins: [UIkit.mixin.toggle],

        props: {
            targets: String,
            active: null,
            collapseAll: Boolean,
            multiExpand: Boolean,
            clsToggle: String,
            clsContainer: String,
            transition: String
        },

        defaults: {
            targets: '>',
            active: false,
            animation: true,
            collapseAll: false,
            multiExpand: false,
            cls: 'uk-active',
            clsItem: 'uk-accordion-item',
            clsToggle: 'uk-accordion-title',
            clsContainer: 'uk-accordion-content',
            transition: 'ease'
        },

        ready() {

            this.items = toJQuery(this.targets, this.$el);

            if (!this.items) {
                return;
            }

            var self = this;
            this.$el.on('click', `${this.targets} .${this.clsItem} .${this.clsToggle}`, function (e) {
                e.preventDefault();
                self.show(this.closest(`.${self.clsItem}`));
            });

            var active = toJQuery(this.items.filter(`.${this.cls}:first`))
                || this.active !== false && toJQuery(this.items.eq(Number(this.active)))
                || !this.collapseAll && toJQuery(this.items.eq(0));

            if (active) {
                this.show(active, false);
            }
        },

        methods: {

            show(item, animate) {

                var index = typeof item === 'number'
                        ? item
                        : typeof item === 'string'
                            ? parseInt(item, 10)
                            : this.items.index(item),
                    items = [this.items.eq(index)],
                    active = this.items.find(` .${this.clsContainer}.${this.cls}`);

                if (!this.multiExpand) {
                    active.each((i, el) => {
                        item = $(el).closest(`.${this.clsItem}`);
                        if (item[0] !== items[0][0]) {
                            items.push(item);
                        }
                    });
                }

                items.forEach((item, i) => {
                    var content = item.find(`.${this.clsContainer}`), state = i === 0;

                    if (state && (this.collapseAll || active.length > 1)) {
                        state = null;
                    }

                    item.toggleClass(this.cls, this.isToggled(content));
                    this.toggleState(content, animate, state);
                })
            }

        }

    });

}
