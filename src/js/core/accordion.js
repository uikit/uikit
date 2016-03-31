import {toJQuery, Transition, requestAnimationFrame} from '../util/index';

export default function (UIkit) {

    UIkit.component('accordion', {

        mixins: [UIkit.mixin.toggable],

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
            collapsible: true,
            multiple: false,
            clsOpen: 'uk-open',
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

            this.items.each((i, el) => {
                el = $(el);
                this.toggleState(el.find(this.content), false, el.hasClass(this.clsOpen));
            });

            var active = this.active !== false && toJQuery(this.items.eq(Number(this.active)))
                || !this.collapsible && toJQuery(this.items.eq(0));

            if (active && !active.hasClass(this.clsOpen)) {
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
                    active = this.items.filter(`.${this.clsOpen}`);

                item = this.items.eq(index);

                item.add(!this.multiple && active).each((i, el) => {

                    el = $(el);

                    var content = el.find(this.content), isItem = el.is(item), state = isItem && !el.hasClass(this.clsOpen);

                    if (!state && isItem && !this.collapsible && active.length < 2) {
                        return;
                    }

                    el.toggleClass(this.clsOpen, state);

                    if (!Transition.inProgress(content.parent())) {
                        content.wrap('<div>');
                        content.parent().attr('hidden', state);
                    }

                    this.toggleState(content, false, true);

                    this.toggleState(content.parent(), animate, state).then(() => {
                        requestAnimationFrame(() => {
                            if (!Transition.inProgress(content.parent())) {

                                if (!el.hasClass(this.clsOpen)) {
                                    this.toggleState(content, false, false);
                                }

                                content.unwrap();
                            }
                        });
                    });
                })
            }

        }

    });

}
