import { Class, Toggable } from '../mixin/index';
import { $, getIndex, toJQuery } from '../util/index';

export default function (UIkit) {

    UIkit.component('accordion', {

        mixins: [Class, Toggable],

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
            animation: [true],
            collapsible: true,
            multiple: false,
            clsOpen: 'uk-open',
            toggle: '> .uk-accordion-title',
            content: '> .uk-accordion-content',
            transition: 'ease'
        },

        computed: {

            items() {
                var items = $(this.targets, this.$el);
                this._changed = !this._items || items.length !== this._items.length || items.toArray().some((el, i) => el !== this._items.get(i));
                return this._items = items;
            }

        },

        connected() {
            this.$emitSync();
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return `${this.targets} ${this.$props.toggle}`;
                },

                handler(e) {
                    e.preventDefault();
                    this.toggle(this.items.find(this.$props.toggle).index(e.currentTarget));
                }

            }

        ],

        update() {

            if (!this.items || !this._changed) {
                return;
            }

            this.items.each((i, el) => {
                el = $(el);
                this.toggleNow(el.find(this.content), el.hasClass(this.clsOpen));
            });

            var active = this.active !== false && toJQuery(this.items.eq(Number(this.active))) || !this.collapsible && toJQuery(this.items.eq(0));
            if (active && !active.hasClass(this.clsOpen)) {
                this.toggle(active, false);
            }

        },

        methods: {

            toggle(item, animate) {

                var index = getIndex(item, this.items),
                    active = this.items.filter(`.${this.clsOpen}`);

                item = this.items.eq(index);

                item.add(!this.multiple && active).each((i, el) => {

                    el = $(el);

                    var isItem = el.is(item), state = isItem && !el.hasClass(this.clsOpen);

                    if (!state && isItem && !this.collapsible && active.length < 2) {
                        return;
                    }

                    el.toggleClass(this.clsOpen, state);

                    var content = el[0]._wrapper ? el[0]._wrapper.children().first() : el.find(this.content);

                    if (!el[0]._wrapper) {
                        el[0]._wrapper = content.wrap('<div>').parent().attr('hidden', state);
                    }

                    this._toggleImmediate(content, true);
                    this.toggleElement(el[0]._wrapper, state, animate).then(() => {
                        if (el.hasClass(this.clsOpen) === state) {

                            if (!state) {
                                this._toggleImmediate(content, false);
                            }

                            el[0]._wrapper = null;
                            content.unwrap();
                        }
                    });

                })
            }

        }

    });

}
