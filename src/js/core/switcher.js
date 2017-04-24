import { Toggable } from '../mixin/index';
import { $, getIndex, isTouch, toJQuery, query } from '../util/index';

export default function (UIkit) {

    UIkit.component('switcher', {

        mixins: [Toggable],

        args: 'connect',

        props: {
            connect: String,
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

        connected() {
            this.$emitSync();
        },

        computed: {

            connects() {
                return query(this.connect, this.$el) || $(this.$el.next(`.${this.clsContainer}`));
            },

            toggles() {
                return $(this.toggle, this.$el);
            }

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

            },

            {
                name: 'click',

                el() {
                    return this.connects;
                },

                delegate() {
                    return `[${this.attrItem}],[data-${this.attrItem}]`;
                },

                handler(e) {
                    e.preventDefault();
                    this.show($(e.currentTarget)[e.currentTarget.hasAttribute(this.attrItem) ? 'attr' : 'data'](this.attrItem));
                }
            },

            {
                name: 'swipeRight swipeLeft',

                filter() {
                    return this.swiping;
                },

                el() {
                    return this.connects;
                },

                handler(e) {
                    if (!isTouch(e)) {
                        return;
                    }

                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                    }
                }
            }

        ],

        update() {

            this.updateAria(this.connects.children());
            this.show(toJQuery(this.toggles.filter(`.${this.cls}:first`)) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());

        },

        methods: {

            show(item) {

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
