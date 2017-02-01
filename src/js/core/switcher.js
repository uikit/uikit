import { Toggable } from '../mixin/index';
import { $, getIndex, toJQuery } from '../util/index';

export default function (UIkit) {

    UIkit.component('switcher', {

        mixins: [Toggable],

        args: 'connect',

        props: {
            connect: 'jQuery',
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: false,
            toggle: ' > *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return `${this.toggle}:not(.uk-disabled)`;
                },

                handler(e) {
                    e.preventDefault();
                    this.show(e.currentTarget);
                }

            }

        ],

        update() {

            this.toggles = $(this.toggle, this.$el);
            this.connects = this.connect || $(this.$el.next(`.${this.clsContainer}`));

            var click = `click.${this.$options.name}`;
            this.connects.off(click).on(click, `[${this.attrItem}],[data-${this.attrItem}]`, e => {
                e.preventDefault();
                this.show($(e.currentTarget)[e.currentTarget.hasAttribute(this.attrItem) ? 'attr' : 'data'](this.attrItem));
            });

            if (this.swiping) {
                var swipe = `swipeRight.${this.$options.name} swipeLeft.${this.$options.name}`;
                this.connects.off(swipe).on(swipe, e => {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
                    }
                });
            }

            this.updateAria(this.connects.children());

            this.show(toJQuery(this.toggles.filter(`.${this.cls}:first`)) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());

        },

        methods: {

            show(item) {

                if (!this.toggles) {
                    this.$emitSync();
                }

                var length = this.toggles.length,
                    prev = this.connects.children(`.${this.cls}`).index(),
                    hasPrev = prev >= 0,
                    index = getIndex(item, this.toggles, prev),
                    dir = item === 'previous' ? -1 : 1,
                    toggle;

                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
                    if (!this.toggles.eq(index).is('.uk-disabled, [disabled]')) {
                        toggle = this.toggles.eq(index);
                        break;
                    }
                }

                if (!toggle || prev >= 0 && toggle.hasClass(this.cls) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
                toggle.addClass(this.cls).attr('aria-expanded', true);

                if (!hasPrev) {
                    this.toggleNow(this.connects.children(`:nth-child(${index + 1})`));
                } else {
                    this.toggleElement(this.connects.children(`:nth-child(${prev + 1}),:nth-child(${index + 1})`));
                }
            }

        }

    });

}
