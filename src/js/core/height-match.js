import $ from 'jquery';
import {requestAnimationFrame} from '../util/index';

export default function (UIkit) {

    UIkit.component('height-match', {

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: false,
            row: true
        },

        update: {

            handler() {

                let elements = (this.target ? $(this.target, this.$el) : this.$el.children()).css('min-height', '');

                if (!this.row) {
                    this.match(elements);
                    return this;
                }

                requestAnimationFrame(() => {

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

                });

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
                        max = Math.max(max, $(el).outerHeight());
                    })
                    .each((i, el) => {
                        el = $(el);
                        el.css('min-height', `${max - (el.css('box-sizing') === 'border-box' ? 0 : (el.outerHeight() - el.height()))}px`);
                    });
            }

        }

    });

}
