import { Class, Togglable } from '../mixin/index';
import { $, $$, attr, filter, getIndex, hasClass, includes, index, toggleClass, unwrap, wrapAll } from '../util/index';

export default function (UIkit) {

    UIkit.component('accordion', {

        mixins: [Class, Togglable],

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

            items({targets}, $el) {
                return $$(targets, $el);
            }

        },

        events: [

            {

                name: 'click',

                self: true,

                delegate() {
                    return `${this.targets} ${this.$props.toggle}`;
                },

                handler(e) {
                    e.preventDefault();
                    this.toggle(index($$(`${this.targets} ${this.$props.toggle}`, this.$el), e.current));
                }

            }

        ],

        ready() {
            var active = this.active !== false && this.items[Number(this.active)] && !hasClass(active, this.clsOpen);
            if (active) {
                this.toggle(active, false);
            }
        },

        update() {

            this.items.forEach(el => this.toggleNow($(this.content, el), hasClass(el, this.clsOpen)));

            var active = !this.collapsible && !hasClass(this.items, this.clsOpen) && this.items[0];
            if (active) {
                this.toggle(active, false);
            }
        },

        methods: {

            toggle(item, animate) {

                var index = getIndex(item, this.items),
                    active = filter(this.items, `.${this.clsOpen}`);

                item = this.items[index];

                item && [item]
                    .concat(!this.multiple && !includes(active, item) && active || [])
                    .forEach(el => {

                        var isItem = el === item, state = isItem && !hasClass(el, this.clsOpen);

                        if (!state && isItem && !this.collapsible && active.length < 2) {
                            return;
                        }

                        toggleClass(el, this.clsOpen, state);

                        var content = el._wrapper ? el._wrapper.firstElementChild : $(this.content, el);

                        if (!el._wrapper) {
                            el._wrapper = wrapAll(content, '<div>');
                            attr(el._wrapper, 'hidden', state ? '' : null);
                        }

                        this._toggleImmediate(content, true);
                        this.toggleElement(el._wrapper, state, animate).then(() => {
                            if (hasClass(el, this.clsOpen) === state) {

                                if (!state) {
                                    this._toggleImmediate(content, false);
                                }

                                el._wrapper = null;
                                unwrap(content);
                            }
                        });

                    })
            }

        }

    });

}
