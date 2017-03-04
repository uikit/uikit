import { $ } from '../util/index';

export default function (UIkit) {

    UIkit.component('height-match', {

        args: 'target',

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: '> *',
            row: true
        },

        update: {

            write() {

                var elements = $(this.target, this.$el).css('min-height', '');

                if (!this.row) {
                    this.match(elements);
                    return this;
                }

                var lastOffset = false, group = [];

                elements.each((i, el) => {

                    el = $(el);

                    var offset = el.offset().top;

                    if (offset != lastOffset && group.length) {
                        this.match($(group));
                        group = [];
                        offset = el.offset().top;
                    }

                    group.push(el);
                    lastOffset = offset;
                });

                if (group.length) {
                    this.match($(group));
                }

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            match(elements) {

                if (elements.length < 2) {
                    return;
                }

                var max = 0;

                elements
                    .each((i, el) => {

                        el = $(el);

                        var height;

                        if (el.css('display') === 'none') {
                            var style = el.attr('style');
                            el.attr('style', `${style};display:block !important;`);
                            height = el.outerHeight();
                            el.attr('style', style || '');
                        } else {
                            height = el.outerHeight();
                        }

                        max = Math.max(max, height);

                    })
                    .each((i, el) => {
                        el = $(el);
                        el.css('min-height', `${max - (el.outerHeight() - parseFloat(el.css('height')))}px`);
                    });
            }

        }

    });

}
