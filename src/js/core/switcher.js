import $ from 'jquery';
import {isString, toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('switcher', {

        mixins: [UIkit.mixin.toggable],

        props: {
            connect: 'jQuery',
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: false,
            toggle: '> *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            attrItem: 'uk-switcher-item'
        },

        ready() {

            this.toggles = toJQuery(this.toggle, this.$el);

            if (!this.connect || !this.toggles) {
                return;
            }

            this.$el.on('click', this.toggle + ':not(.uk-disabled)', e => {
                e.preventDefault();
                this.show(e.currentTarget);
            });

            this.connect.on('click', `[${this.attrItem}]`, e => {
                e.preventDefault();
                this.show($(e.currentTarget).attr(this.attrItem));
            });

            if (this.swiping) {
                this.connect.on('swipeRight swipeLeft', e => {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
                    }
                });
            }

            this.updateAria(this.connect.children());
            this.show(toJQuery(this.toggles.filter(`.${this.cls}:first`)) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());
        },

        methods: {

            show(item) {

                var length = this.toggles.length,
                    prev = this.connect.children(`.${this.cls}`).index(),
                    hasPrev = prev >= 0,
                    index = (item === 'next'
                        ? prev + 1
                        : item === 'previous'
                            ? prev - 1
                            : isString(item)
                                ? parseInt(item, 10)
                                : typeof item === 'number'
                                    ? item
                                    : this.toggles.index(item)
                        ) % length,
                    toggle,
                    dir = item === 'previous' ? -1 : 1;

                index = index < 0 ? index + length : index;

                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
                    if (!this.toggles.eq(index).is('.uk-disabled, [disabled]')) {
                        toggle = this.toggles.eq(index);
                        break;
                    }
                }

                if (!toggle || (prev >= 0 && toggle.hasClass(this.cls)) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
                toggle.addClass(this.cls).attr('aria-expanded', true);

                this.toggleElement(hasPrev ? this.connect.children(`:nth-child(${prev + 1})`) : undefined, null, hasPrev).then(() => {
                    this.toggleElement(this.connect.children(`:nth-child(${index + 1})`), null, hasPrev);
                });

            }

        }

    });

}
