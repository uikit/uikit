import $ from 'jquery';
import {Animation, toJQuery} from '../util/index';
import toggleMixin from '../mixin/toggle';

export default function (UIkit) {

    UIkit.component('switcher', {

        mixins: [toggleMixin],

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
            cls: 'uk-active',
            swiping: true
        },

        ready() {

            this.toggles = toJQuery(this.toggle, this.$el);

            if (!this.connect || !this.toggles) {
                return;
            }

            var self = this;
            this.$el.on('click', this.toggle + ':not(.uk-disabled)', function (e) {
                e.preventDefault();
                self.show(this);
            });

            this.connect.on('click', '[uk-switcher-item]', function (e) {
                e.preventDefault();
                self.show($(this).attr('uk-switcher-item'));
            });

            if (this.swiping) {
                this.connect.on('swipeRight swipeLeft', e => {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type == 'swipeLeft' ? 'next' : 'previous');
                    }
                });
            }

            this.show(toJQuery(this.toggles.filter(`.${this.cls}`)) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());

        },

        methods: {

            show: function (item) {

                var length = this.toggles.length,
                    prev = this.connect.children(`.${this.cls}`).index(),
                    hasPrev = prev >= 0,
                    index = Math.max(0, item === 'next'
                        ? prev + 1
                        : item === 'previous'
                            ? prev + length - 1
                            : typeof item === 'string'
                                ? parseInt(item, 10)
                                : this.toggles.index(item)
                        ) % length,
                    toggle,
                    dir = item === 'previous' ? -1 : 1;

                for (var i = 0, j = index; i < length; i++, j += dir, j %= length) {
                    if (!this.toggles.eq(j).is('.uk-disabled, [disabled]')) {
                        toggle = this.toggles.eq(j);
                        index = j;
                        break;
                    }
                }

                if (!toggle || (prev >= 0 && toggle.hasClass(this.cls)) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls)
                toggle.addClass(this.cls);

                this.toggleState(hasPrev ? this.connect.children(`:nth-child(${prev + 1})`) : undefined, hasPrev).then(() => {
                    this.toggleState(this.connect.children(`:nth-child(${index + 1})`), hasPrev);
                });

            }

        }

    });

}
