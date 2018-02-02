import {Togglable} from '../mixin/index';
import {$$, addClass, attr, data, filter, getIndex, hasClass, index, isTouch, matches, queryAll, removeClass, win} from '../util/index';

export default function (UIkit) {

    UIkit.component('switcher', {

        mixins: [Togglable],

        args: 'connect',

        props: {
            connect: String,
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: '~.uk-switcher',
            toggle: '> *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        computed: {

            connects({connect}, $el) {
                return queryAll(connect, $el);
            },

            toggles({toggle}, $el) {
                return $$(toggle, $el);
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
                    this.show(e.current);
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
                    this.show(data(e.current, this.attrItem));
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
                    if (!win.getSelection().toString()) {
                        this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                    }
                }
            }

        ],

        update() {

            this.connects.forEach(list => this.updateAria(list.children));
            this.show(filter(this.toggles, `.${this.cls}`)[0] || this.toggles[this.active] || this.toggles[0]);

        },

        methods: {

            show(item) {

                const {length} = this.toggles;
                const prev = !!this.connects.length && index(filter(this.connects[0].children, `.${this.cls}`)[0]);
                const hasPrev = prev >= 0;
                const dir = item === 'previous' ? -1 : 1;

                let toggle, next = getIndex(item, this.toggles, prev);

                for (let i = 0; i < length; i++, next = (next + dir + length) % length) {
                    if (!matches(this.toggles[next], '.uk-disabled, [disabled]')) {
                        toggle = this.toggles[next];
                        break;
                    }
                }

                if (!toggle || prev >= 0 && hasClass(toggle, this.cls) || prev === next) {
                    return;
                }

                removeClass(this.toggles, this.cls);
                attr(this.toggles, 'aria-expanded', false);
                addClass(toggle, this.cls);
                attr(toggle, 'aria-expanded', true);

                this.connects.forEach(list => {
                    if (!hasPrev) {
                        this.toggleNow(list.children[next]);
                    } else {
                        this.toggleElement([list.children[prev], list.children[next]]);
                    }
                });

            }

        }

    });

}
