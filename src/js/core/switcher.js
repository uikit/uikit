import $ from 'jquery';
import {Animation, toJQuery} from '../util/index';
import toggleMixin from '../mixin/toggle';

// TODO swipe

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

                var items = this.connect.first().children(),
                    prev = items.index(items.filter(`.${this.cls}`)),
                    hasPrev = prev >= 0,
                    index = Math.min(this.toggles.length - 1, Math.max(0, item === 'next'
                        ? prev + 1
                        : item === 'previous'
                            ? prev - 1
                            : typeof item === 'string'
                                ? parseInt(item, 10)
                                : this.toggles.index(item)
                    )),
                    toggle = this.toggles.eq(index);

                if ((prev >= 0 && toggle.hasClass(this.cls)) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls)
                toggle.addClass(this.cls);

                this.connect.each((i, connect) => {

                    var children = $(connect).children();
                    this.toggleState(hasPrev ? children.eq(prev) : undefined, hasPrev).then(() => {
                        this.toggleState(children.eq(index), hasPrev);
                    });

                })

            }

        }

    });

}
