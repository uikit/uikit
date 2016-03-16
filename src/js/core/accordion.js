import {toJQuery, Transition} from '../util/index';

export default function (UIkit) {

    UIkit.component('accordion', {

        mixins: [UIkit.mixin.toggle],

        props: {
            targets: String,
            active: null,
            collapsible: Boolean,
            multiple: Boolean,
            toggle: String,
            content: String,
            transition: String
        },

        defaults: {
            targets: '> *',
            active: false,
            animation: true,
            collapsible: false,
            multiple: false,
            cls: 'uk-open',
            toggle: '.uk-accordion-title',
            content: '.uk-accordion-content',
            transition: 'ease'
        },

        ready() {

            this.items = toJQuery(this.targets, this.$el);

            if (!this.items) {
                return;
            }

            var self = this;
            this.$el.on('click', `${this.targets} ${this.toggle}`, function (e) {
                e.preventDefault();
                self.show(self.items.find(self.toggle).index(this));
            });

            var active = toJQuery(this.items.filter(`.${this.cls}:first`))
                || this.active !== false && toJQuery(this.items.eq(Number(this.active)))
                || !this.collapsible && toJQuery(this.items.eq(0));

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
                    active = this.items.find(`${this.content}.${this.cls}`);

                if (!this.multiple) {
                    active.each((i, el) => {
                        item = this.items.eq(this.items.find(this.content).index(el));

                        if (item[0] !== items[0][0]) {
                            items.push(item);
                        }
                    });
                }

                items.forEach((item, i) => {
                    var content = item.find(this.content), state = i === 0;

                    if (state && (this.collapsible || active.length > 1)) {
                        state = null;
                    }

                    item.toggleClass(this.cls, state);
                    this.toggleState(content, animate, state);
                })
            }

        }

    });

}
