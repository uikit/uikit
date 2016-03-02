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
            active: Number
        },

        defaults: {
            connect: false,
            toggle: '> *',
            active: 0,
            cls: 'uk-active'
            //swiping   : true
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

            this.show(toJQuery(this.toggles.filter(`.${this.cls}`)) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first(), false);

        },

        methods: {

            show: function (item, animate) {

                var items = this.connect.first().children(),
                    prev = items.index(items.filter(`.${this.cls}`)),
                    index = Math.min(this.toggles.length - 1, Math.max(0, item === 'next'
                        ? prev + 1
                        : item === 'previous'
                            ? prev - 1
                            : typeof item === 'string'
                                ? parseInt(item, 10)
                                : this.toggles.index(item)
                    ));

                this.toggles.removeClass(this.cls).eq(index).addClass(this.cls);

                if (prev !== index) {
                    this.connect.each((i, connect) => {

                        var children = $(connect).children(), deactivate = children.eq(prev);

                        if (this.animation) {
                            Animation.cancel(deactivate);
                        }

                        this.toggleState(deactivate, false, animate).then(() => {
                            this.toggleState(children.eq(index), true, animate);
                        });

                    })
                }

            }

        }

    });

}
