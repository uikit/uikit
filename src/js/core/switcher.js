import $ from 'jquery';
import {toJQuery} from '../util/index';
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

            this.items = this.connect.children();

            var self = this;
            this.$el.on('click', this.toggle + ':not(.uk-disabled)', function (e) {
                e.preventDefault();
                self.show(this);
            });

            this.connect.on('click', '[uk-switcher-item]', function (e) {
                e.preventDefault();
                self.show($(this).attr('uk-switcher-item'));
            }).on('show hide', function(e, el) {
                self.toggles.eq(self.items.index(el)).toggleClass('uk-active', e.type === 'show');
            });

            this.show(toJQuery(this.toggles.filter('.uk-active')) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first(), false);

        },

        methods: {

            show: function (item, animate) {

                var active = this.items.filter((i, el) => { return this.isToggled(el); }),
                    prev = this.items.index(active),
                    index = Math.min(this.items.length - 1, Math.max(0, item === 'next'
                        ? prev + 1
                        : item === 'previous'
                            ? prev - 1
                            : typeof item === 'string'
                                ? parseInt(item, 10)
                                : this.toggles.index(item)
                    ));

                if (prev !== index) {
                    this.toggleState(active, false, animate).then(() => {
                        this.toggleState(this.items.eq(index), true, animate);
                    });
                }

            }

        }

    });

}
